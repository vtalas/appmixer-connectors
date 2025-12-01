#!/usr/bin/env node
'use strict';

/**
 * Generic test script to validate component output against its schema.
 *
 * Requirements:
 * - Component must export `outputSchema` (the item schema object)
 * - Component must export `outputLabel` (label for array output, e.g., 'Documents')
 *
 * Usage:
 *   node scripts/test-output-schema.js <component-path> [outputType]
 *
 * Examples:
 *   node scripts/test-output-schema.js ./src/appmixer/googleDocs/core/FindDocuments
 *   node scripts/test-output-schema.js ./src/appmixer/googleDocs/core/FindDocuments array
 *   node scripts/test-output-schema.js ./src/appmixer/stripe/core/FindCustomers first
 */

const path = require('path');
const { execSync } = require('child_process');
const validator = require('./validate-output-schema');

const componentPath = process.argv[2];
const specificOutputType = process.argv[3];

if (!componentPath) {
    console.error('Usage: node test-output-schema.js <component-path> [outputType]');
    console.error('');
    console.error('The component must export:');
    console.error('  - outputSchema: Object defining the item schema');
    console.error('  - outputLabel: String label for array output (e.g., "Documents")');
    process.exit(1);
}

const OUTPUT_TYPES = specificOutputType ? [specificOutputType] : ['first', 'array', 'object'];

/**
 * Load component module and extract schema.
 */
function loadComponentSchema(componentPath) {
    const absolutePath = path.resolve(process.cwd(), componentPath);
    const componentName = path.basename(componentPath);

    try {
        // Try to require the component's JS file
        const jsFile = path.join(absolutePath, `${componentName}.js`);
        const component = require(jsFile);

        if (!component.outputSchema) {
            console.error(`Error: Component does not export 'outputSchema'`);
            console.error(`Add this to your component:`);
            console.error(`  module.exports = {`);
            console.error(`    outputSchema,`);
            console.error(`    outputLabel,`);
            console.error(`    async receive(context) { ... }`);
            console.error(`  };`);
            process.exit(1);
        }

        return {
            schema: component.outputSchema,
            label: component.outputLabel || 'Items'
        };
    } catch (error) {
        console.error(`Error loading component: ${error.message}`);
        process.exit(1);
    }
}

/**
 * Run appmixer test component and parse output.
 */
function runComponentTest(componentPath, input) {
    const inputJson = JSON.stringify(input);
    const cmd = `appmixer test component ${componentPath} -i '${inputJson}' 2>&1`;

    try {
        const output = execSync(cmd, { encoding: 'utf-8', timeout: 60000 });
        return parseTestOutput(output);
    } catch (error) {
        console.error('Test command failed:', error.message);
        return null;
    }
}

/**
 * Parse the component test output to extract the sent JSON.
 */
function parseTestOutput(output) {
    // Look for "Component has send a message to output port:"
    const match = output.match(/Component has send a message to output port: \w+\n([\s\S]*?)\n\n/);
    if (match) {
        try {
            const jsonMatch = output.match(/Component has send a message to output port: \w+\n(\{[\s\S]*?\})\n\n/);
            if (jsonMatch) {
                const jsObject = jsonMatch[1];
                // Use eval since appmixer outputs JS object notation, not JSON
                const result = eval('(' + jsObject + ')');
                return result;
            }
        } catch (e) {
            // Fall through to alternative parsing
        }
    }

    // Try alternative parsing for array output (larger objects)
    const arrayMatch = output.match(/\{\s*result:\s*\[[\s\S]*?\],\s*count:\s*\d+\s*\}/);
    if (arrayMatch) {
        try {
            return eval('(' + arrayMatch[0] + ')');
        } catch (e) {
            console.error('Failed to parse array output:', e.message);
        }
    }

    return null;
}

/**
 * Build expected schema based on outputType.
 * Mirrors the logic in lib.js getOutputPortOptions().
 */
function buildExpectedSchema(itemSchema, label, outputType) {
    if (outputType === 'object' || outputType === 'first') {
        const options = Object.keys(itemSchema).reduce((res, field) => {
            const schema = itemSchema[field];
            const { title: fieldLabel, ...schemaWithoutTitle } = schema;
            res.push({ label: fieldLabel, value: field, schema: schemaWithoutTitle });
            return res;
        }, [
            { label: 'Current Item Index', value: 'index', schema: { type: 'integer' } },
            { label: 'Items Count', value: 'count', schema: { type: 'integer' } }
        ]);
        return options;
    }

    if (outputType === 'array') {
        return [{
            label: 'Items Count',
            value: 'count',
            schema: { type: 'integer' }
        }, {
            label: label,
            value: 'result',
            schema: {
                type: 'array',
                items: { type: 'object', properties: itemSchema }
            }
        }];
    }

    if (outputType === 'file') {
        return [{ label: 'File ID', value: 'fileId', schema: { type: 'string' } }];
    }

    return [];
}

async function main() {
    // Load schema from component
    const { schema: itemSchema, label } = loadComponentSchema(componentPath);

    console.log(`\nValidating output schema for: ${componentPath}`);
    console.log(`Schema fields: ${Object.keys(itemSchema).join(', ')}`);
    console.log(`Output label: ${label}\n`);
    console.log('='.repeat(60));

    const results = {};

    for (const outputType of OUTPUT_TYPES) {
        console.log(`\nTesting outputType: ${outputType}`);
        console.log('-'.repeat(40));

        // Run the component test
        const testInput = { in: { outputType } };
        const actualOutput = runComponentTest(componentPath, testInput);

        if (!actualOutput) {
            console.log(`  ❌ Failed to get output for ${outputType}`);
            results[outputType] = { valid: false, errors: ['Failed to get output'] };
            continue;
        }

        // Truncate output for display
        const outputPreview = JSON.stringify(actualOutput, null, 2);
        console.log('  Actual output:', outputPreview.substring(0, 200) + (outputPreview.length > 200 ? '...' : ''));

        // Build expected schema
        const expectedSchema = buildExpectedSchema(itemSchema, label, outputType);

        console.log(expectedSchema)
        // Validate structure
        const validation = validator.validateOutput({
            actualOutput,
            outputPortOptions: expectedSchema,
            outputType
        });

        results[outputType] = validation;

        if (validation.valid) {
            console.log(`  ✅ Schema validation PASSED`);
        } else {
            console.log(`  ❌ Schema validation FAILED`);
            console.log('  Errors:', JSON.stringify(validation.errors, null, 2));
        }

        // Check for field mismatches in actual data vs declared schema
        const firstItem = validator.extractFirstItem(actualOutput, outputType);
        if (firstItem) {
            const mismatches = validator.findSchemaMismatches(itemSchema, firstItem);

            if (mismatches.missingInSchema.length > 0) {
                console.log(`  ⚠️  Fields in data but not in schema: ${mismatches.missingInSchema.join(', ')}`);
            }
            if (mismatches.missingInData.length > 0) {
                console.log(`  ⚠️  Fields in schema but not in data: ${mismatches.missingInData.join(', ')}`);
            }
            if (mismatches.typeMismatches.length > 0) {
                console.log(`  ⚠️  Type mismatches:`, mismatches.typeMismatches);
            }

            results[outputType].mismatches = mismatches;
        }
    }

    // Summary
    console.log('\n' + '='.repeat(60));
    console.log('SUMMARY');
    console.log('='.repeat(60));

    let allPassed = true;
    for (const [outputType, result] of Object.entries(results)) {
        const status = result.valid ? '✅' : '❌';
        const warnings = result.mismatches &&
            (result.mismatches.missingInSchema.length > 0 ||
             result.mismatches.missingInData.length > 0 ||
             result.mismatches.typeMismatches.length > 0) ? ' ⚠️' : '';
        console.log(`  ${status} ${outputType}${warnings}`);
        if (!result.valid) allPassed = false;
    }

    console.log('');
    process.exit(allPassed ? 0 : 1);
}

main().catch(console.error);
