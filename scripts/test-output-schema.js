#!/usr/bin/env node
'use strict';

/**
 * Generic test script to validate component output against its schema.
 *
 * Supports two schema patterns:
 *
 * 1. Dynamic schema (Find/List components):
 *    - Component exports `outputSchema` and `outputLabel` in JS file
 *    - component.json has generateOutputPortOptions: true
 *    - Schema varies based on outputType (first/array/object/file)
 *    - Can be tested without specific inputs
 *
 * 2. Static schema (Get/Create/Update components):
 *    - Schema defined directly in component.json outPorts[].options
 *    - Always returns same structure
 *    - Requires specific inputs (documentId, etc.) - use --input flag
 *
 * How it works:
 * - Detects which pattern the component uses
 * - For dynamic schemas, uses connector's lib.js getOutputPortOptions() if available
 * - Falls back to manual schema generation if lib.js doesn't exist
 *
 * Usage:
 *   node scripts/test-output-schema.js <component-path> [outputType]
 *
 * Examples:
 *   # Test dynamic schema (Find/List) - no input needed
node scripts/test-output-schema.js ./src/appmixer/googleDocs/core/FindDocuments
node scripts/test-output-schema.js ./src/appmixer/googleDocs/core/FindDocuments array
node scripts/test-output-schema.js ./src/appmixer/googleDocs/core/GetDocumentContent --input '{"documentId":"14rhXLc254rFk-deehyPUI9VU07RGujsfd3iZNhUHzmg"}'

 appmixer test component src/appmixer/googleDocs/core/FindDocuments
appmixer test component ./src/appmixer/googleDocs/core/GetDocumentContent -i '{"in":{"documentId":"14rhXLc254rFk-deehyPUI9VU07RGujsfd3iZNhUHzmg"}}'

 *
 *   # Test static schema (Get/Create/Update) - provide required inputs
 *   node scripts/test-output-schema.js ./src/appmixer/googleDocs/core/GetDocumentContent --input '{"documentId":"123"}'
 */

const path = require('path');
const { execSync } = require('child_process');
const validator = require('./validate-output-schema');

// Parse command line arguments
const args = process.argv.slice(2);
let componentPath = null;
let specificOutputType = null;
let customInput = null;

for (let i = 0; i < args.length; i++) {
    const arg = args[i];

    if (arg === '--input') {
        customInput = JSON.parse(args[++i]);
    } else if (!componentPath) {
        componentPath = arg;
    } else if (!specificOutputType) {
        specificOutputType = arg;
    }
}

if (!componentPath) {
    console.error('Usage: node test-output-schema.js <component-path> [outputType] [--input <json>]');
    console.error('');
    console.error('Supports two patterns:');
    console.error('  1. Dynamic schema (Find/List): exports outputSchema and outputLabel');
    console.error('  2. Static schema (Get/Create/Update): schema in component.json');
    console.error('');
    console.error('Examples:');
    console.error('  node scripts/test-output-schema.js ./src/appmixer/googleDocs/core/FindDocuments');
    console.error('  node scripts/test-output-schema.js ./src/appmixer/googleDocs/core/GetDocumentContent --input \'{"documentId":"123"}\'');
    process.exit(1);
}

/**
 * Load component schema from either JS file (dynamic) or component.json (static).
 *
 * Dynamic pattern (Find/List components):
 *   - Schema exported in JS file as outputSchema and outputLabel
 *   - component.json has generateOutputPortOptions: true
 *
 * Static pattern (Get/Create/Update components):
 *   - Schema defined directly in component.json outPorts[].options
 */
function loadComponentSchema(componentPath) {
    const absolutePath = path.resolve(process.cwd(), componentPath);
    const componentName = path.basename(componentPath);

    try {
        // Try to load from JS file first (dynamic pattern)
        const jsFile = path.join(absolutePath, `${componentName}.js`);
        const component = require(jsFile);

        if (component.outputSchema) {
            return {
                schema: component.outputSchema,
                label: component.outputLabel || 'Items',
                type: 'dynamic'
            };
        }

        // Fall back to component.json (static pattern)
        const componentJsonPath = path.join(absolutePath, 'component.json');
        delete require.cache[require.resolve(componentJsonPath)]; // Clear cache
        const componentJson = require(componentJsonPath);
        const outPort = componentJson.outPorts?.[0];

        if (outPort?.options && Array.isArray(outPort.options)) {
            // Convert component.json options format to outputSchema format
            const schema = {};

            for (const option of outPort.options) {
                // Handle two formats:
                // 1. Array of {label, value, schema} objects
                // 2. Array with single object containing all fields as properties
                if (option.value && option.schema) {
                    // Format 1: {label, value, schema}
                    schema[option.value] = {
                        ...option.schema,
                        title: option.label
                    };
                } else if (typeof option === 'object') {
                    // Format 2: {fieldName: {type, title, ...}, ...}
                    for (const [fieldName, fieldSchema] of Object.entries(option)) {
                        if (fieldSchema && typeof fieldSchema === 'object') {
                            schema[fieldName] = fieldSchema;
                        }
                    }
                }
            }

            if (Object.keys(schema).length === 0) {
                console.error(`Warning: No valid schema fields found in component.json options`);
                console.error(`Options found:`, JSON.stringify(outPort.options, null, 2));
            }

            return {
                schema,
                label: componentName,
                type: 'static'
            };
        }

        console.error(`Error: Component has neither outputSchema export nor static outPorts options`);
        console.error(`\nFor Find/List components, add to ${componentName}.js:`);
        console.error(`  module.exports = {`);
        console.error(`    outputSchema,`);
        console.error(`    outputLabel,`);
        console.error(`    async receive(context) { ... }`);
        console.error(`  };`);
        console.error(`\nFor Get/Create/Update components, add to component.json:`);
        console.error(`  "outPorts": [{ "name": "out", "options": [...] }]`);
        process.exit(1);
    } catch (error) {
        console.error(`Error loading component: ${error.message}`);
        process.exit(1);
    }
}

/**
 * Run appmixer test component and parse output.
 */
function runComponentTest(componentPath, input, options = null) {
    const inputJson = JSON.stringify(input);
    const cmd = `appmixer test component ${componentPath} -i '${inputJson}' 2>&1`;

    try {
        const output = execSync(cmd, { encoding: 'utf-8', timeout: 60000 });
        console.log(cmd);

        return parseTestOutput(output, options);
    } catch (error) {
        console.error('Test command failed:', error.message);
        if (error.stdout) {
            console.error('Output:', error.stdout.toString().slice(-500)); // Last 500 chars
        }
        if (error.stderr) {
            console.error('Error output:', error.stderr.toString().slice(-500));
        }
        return null;
    }
}

/**
 * Map CLI output (with labels) back to actual field names (values).
 * The appmixer CLI displays labels instead of actual field names.
 */
function mapLabelsToValues(output, options) {
    if (!options || !Array.isArray(options)) return output;

    // Build label -> value mapping
    const labelToValue = {};
    for (const option of options) {
        if (option.label && option.value) {
            labelToValue[option.label] = option.value;
        }
    }

    // Map the output keys
    const mapped = {};
    for (const [key, value] of Object.entries(output)) {
        const actualKey = labelToValue[key] || key;
        mapped[actualKey] = value;
    }

    return mapped;
}

/**
 * Parse the component test output to extract the sent JSON.
 */
function parseTestOutput(output, options = null) {
    // First, try to extract from "component output:" line (raw JSON)
    const componentOutputMatch = output.match(/component output: (\{.+\})/);
    if (componentOutputMatch) {
        try {
            return JSON.parse(componentOutputMatch[1]);
        } catch (e) {
            console.error('Failed to parse component output JSON:', e.message);
        }
    }

    // Fallback: Look for "Component has send a message to output port:" (formatted display)
    const match = output.match(/Component has send a message to output port: \w+\n([\s\S]*?)\n\n/);
    if (match) {
        try {
            const jsonMatch = output.match(/Component has send a message to output port: \w+\n(\{[\s\S]*?\})\n\n/);
            if (jsonMatch) {
                const jsObject = jsonMatch[1];
                // Use eval since appmixer outputs JS object notation, not JSON
                let result = eval('(' + jsObject + ')');

                // Map labels back to actual field names for static schemas
                if (options) {
                    result = mapLabelsToValues(result, options);
                }

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
 * Try to load the connector's lib.js and use its getOutputPortOptions function.
 * Falls back to building the schema manually if lib.js doesn't exist.
 */
function loadConnectorLib(componentPath) {
    const absolutePath = path.resolve(process.cwd(), componentPath);

    try {
        // Try to load the connector's lib.js (one level up from component)
        const libPath = path.join(path.dirname(absolutePath), '..', 'lib.js');
        const lib = require(libPath);

        if (lib.getOutputPortOptions && typeof lib.getOutputPortOptions === 'function') {
            return lib;
        }
    } catch (error) {
        // lib.js doesn't exist or doesn't have getOutputPortOptions
    }

    return null;
}

/**
 * Build expected schema using connector's lib.js or fallback implementation.
 */
function buildExpectedSchema(componentPath, itemSchema, label, outputType) {
    const lib = loadConnectorLib(componentPath);

    if (lib && lib.getOutputPortOptions) {
        // Use the connector's lib.js implementation
        let capturedOutput = null;

        const mockContext = {
            sendJson: (data, port) => {
                capturedOutput = data;
                return Promise.resolve();
            }
        };

        lib.getOutputPortOptions(mockContext, outputType, itemSchema, {
            label,
            value: 'result'
        });

        return capturedOutput;
    }

    throw new Error('Failed to load connector lib.js');
}

async function main() {
    // Load schema from component
    const { schema: itemSchema, label, type: schemaType } = loadComponentSchema(componentPath);

    // Determine which output types to test
    let outputTypesToTest;
    if (schemaType === 'static') {
        // Static schemas don't support outputType parameter
        outputTypesToTest = specificOutputType ? [specificOutputType] : ['static'];
    } else {
        // Dynamic schemas support multiple output types
        outputTypesToTest = specificOutputType ? [specificOutputType] : ['first', 'array', 'object'];
    }

    // Check if connector has lib.js with getOutputPortOptions
    const lib = loadConnectorLib(componentPath);
    const usingLib = lib && lib.getOutputPortOptions;

    console.log(`\nValidating output schema for: ${componentPath}`);
    console.log(`Schema type: ${schemaType}`);
    console.log(`Schema fields: ${Object.keys(itemSchema).join(', ')}`);
    console.log(`Output label: ${label}`);
    if (schemaType === 'dynamic') {
        console.log(`Schema source: ${usingLib ? 'connector lib.js' : 'fallback implementation'}`);
    }
    console.log('');
    console.log('='.repeat(60));

    const results = {};

    for (const outputType of outputTypesToTest) {
        console.log(`\nTesting outputType: ${outputType}`);
        console.log('-'.repeat(40));

        // Build expected schema first (needed for static output parsing)
        let expectedSchema;
        if (outputType === 'static') {
            expectedSchema = Object.keys(itemSchema).map(field => ({
                label: itemSchema[field].title || field,
                value: field,
                schema: itemSchema[field]
            }));
        } else {
            expectedSchema = buildExpectedSchema(componentPath, itemSchema, label, outputType);
        }

        // Run the component test
        let testInput;
        if (customInput) {
            // Merge custom input with outputType if applicable
            testInput = { in: { ...customInput, ...(outputType !== 'static' ? { outputType } : {}) } };
        } else {
            testInput = outputType === 'static' ? { in: {} } : { in: { outputType } };
        }
        // Pass options for static schemas to map labels back to values
        const actualOutput = runComponentTest(componentPath, testInput, outputType === 'static' ? expectedSchema : null);

        if (!actualOutput) {
            console.log(`  ❌ Failed to get output for ${outputType}`);
            results[outputType] = { valid: false, errors: ['Failed to get output'] };
            continue;
        }

        // Truncate output for display
        const outputPreview = JSON.stringify(actualOutput, null, 2);
        console.log('  Actual output:', outputPreview.substring(0, 200) + (outputPreview.length > 200 ? '...' : ''));

        console.log(expectedSchema)
        // Validate structure
        const validation = validator.validateOutput({
            actualOutput,
            outputPortOptions: expectedSchema,
            outputType: outputType
        });

        results[outputType] = validation;

        if (validation.valid) {
            console.log(`  ✅ Schema validation PASSED`);
        } else {
            console.log(`  ❌ Schema validation FAILED`);
            if (validation.errors && validation.errors.length > 0) {
                console.log('  Errors:', JSON.stringify(validation.errors, null, 2));
            }
            if (validation.warnings && validation.warnings.length > 0) {
                console.log('  ⚠️  Warnings:', JSON.stringify(validation.warnings, null, 2));
            }
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
