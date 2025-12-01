'use strict';

/**
 * Output Schema Validation Strategy for Appmixer Components
 *
 * This script validates that a component's actual output matches its declared schema.
 * It handles both static schemas (defined in component.json) and dynamic schemas
 * (generated via generateOutputPortOptions based on outputType).
 */

const Ajv = require('ajv');
const ajv = new Ajv({ allErrors: true, strict: false });

/**
 * Converts the Appmixer output port options format to a JSON Schema.
 *
 * Output port options come in format:
 * [{ label: 'Field', value: 'fieldName', schema: { type: 'string' } }, ...]
 *
 * For 'array' outputType, it's:
 * [{ label: 'Items', value: 'items', schema: { type: 'array', items: {...} } }]
 *
 * @param {Array} outputPortOptions - The options array from getOutputPortOptions
 * @param {string} outputType - The output type (first, object, array, file)
 * @returns {Object} JSON Schema object
 */
function convertOutputOptionsToSchema(outputPortOptions, outputType) {
    if (outputType === 'array') {
        // For array type, the schema wraps items in { result: [...], count: N }
        const arrayOption = outputPortOptions.find(opt => opt.schema?.type === 'array');
        if (arrayOption) {
            return {
                type: 'object',
                properties: {
                    result: arrayOption.schema,
                    count: { type: 'integer' }
                },
                required: ['result', 'count']
            };
        }
    }

    if (outputType === 'file') {
        return {
            type: 'object',
            properties: {
                fileId: { type: 'string' }
            },
            required: ['fileId']
        };
    }

    // For 'first' and 'object' types - flat object with all fields
    const properties = {};
    const required = [];

    for (const option of outputPortOptions) {
        properties[option.value] = option.schema || { type: 'string' };
        // index and count are always present
        if (option.value === 'index' || option.value === 'count') {
            required.push(option.value);
        }
    }

    return {
        type: 'object',
        properties,
        required
    };
}

/**
 * Deep validation helper - checks for schema mismatches in nested objects.
 */
function validateDeep(data, schema, path = '') {
    const issues = [];

    if (schema.type === 'object' && schema.properties) {
        const declaredProps = Object.keys(schema.properties);
        const actualProps = Object.keys(data || {});

        // Check for properties in data not in schema
        for (const prop of actualProps) {
            if (!declaredProps.includes(prop)) {
                issues.push({
                    path: path ? `${path}.${prop}` : prop,
                    issue: 'undeclared',
                    message: `Property '${prop}' exists in data but not declared in schema`
                });
            } else {
                // Recursively validate nested objects
                const nestedIssues = validateDeep(data[prop], schema.properties[prop], path ? `${path}.${prop}` : prop);
                issues.push(...nestedIssues);
            }
        }

        // Check for required properties missing in data
        for (const prop of declaredProps) {
            if (!(prop in (data || {}))) {
                const isRequired = schema.required && schema.required.includes(prop);
                if (isRequired) {
                    issues.push({
                        path: path ? `${path}.${prop}` : prop,
                        issue: 'missing',
                        message: `Required property '${prop}' missing in data`
                    });
                }
            }
        }
    } else if (schema.type === 'array' && schema.items && Array.isArray(data)) {
        // Validate array items
        data.forEach((item, index) => {
            const nestedIssues = validateDeep(item, schema.items, `${path}[${index}]`);
            issues.push(...nestedIssues);
        });
    }

    return issues;
}

/**
 * Validates static output (root-level fields against their schemas).
 * For static outputs, each option has {label, value, schema} where:
 * - value: root-level key in output JSON
 * - schema: JSON schema for that field's value
 *
 * @param {Object} actualOutput - The actual output from the component
 * @param {Array} outputPortOptions - Array of {label, value, schema} objects
 * @returns {Object} Validation result { valid: boolean, errors: Array }
 */
function validateStaticOutput(actualOutput, outputPortOptions) {
    const errors = [];
    const warnings = [];
    const expectedFields = new Set();

    // Validate each field against its schema
    for (const option of outputPortOptions) {
        const fieldName = option.value;
        const fieldSchema = option.schema;
        expectedFields.add(fieldName);

        if (!(fieldName in actualOutput)) {
            errors.push({
                field: fieldName,
                message: `Missing required field: ${fieldName}`
            });
            continue;
        }

        // Standard JSON Schema validation
        const validate = ajv.compile(fieldSchema);
        const valid = validate(actualOutput[fieldName]);

        if (!valid) {
            errors.push({
                field: fieldName,
                message: `Validation failed for ${fieldName}`,
                schemaErrors: validate.errors
            });
        }

        // Deep validation for nested structure mismatches
        const deepIssues = validateDeep(actualOutput[fieldName], fieldSchema, fieldName);
        if (deepIssues.length > 0) {
            warnings.push({
                field: fieldName,
                message: 'Schema structure mismatches found',
                issues: deepIssues
            });
        }
    }

    // Check for unexpected fields
    const actualFields = Object.keys(actualOutput);
    for (const field of actualFields) {
        if (!expectedFields.has(field)) {
            errors.push({
                field,
                message: `Unexpected field: ${field}`
            });
        }
    }

    return {
        valid: errors.length === 0 && warnings.length === 0,
        errors,
        warnings,
        actualOutput
    };
}

/**
 * Validates component output against its schema.
 *
 * @param {Object} options
 * @param {Object} options.actualOutput - The actual output from the component
 * @param {Array} options.outputPortOptions - Schema from generateOutputPortOptions
 * @param {string} options.outputType - The output type used
 * @returns {Object} Validation result { valid: boolean, errors: Array }
 */
function validateOutput({ actualOutput, outputPortOptions, outputType }) {
    // For static outputs, use direct field validation
    if (outputType === 'static') {
        return validateStaticOutput(actualOutput, outputPortOptions);
    }

    // For dynamic outputs (first/array/object/file), use schema conversion
    const schema = convertOutputOptionsToSchema(outputPortOptions, outputType);
    const validate = ajv.compile(schema);

    const errors = validate.errors || [];
    const warnings = [];

    // Deep validation for dynamic outputs (first/object)
    if (outputType === 'first' || outputType === 'object') {
        // Build expected schema from all options
        const itemSchema = {
            type: 'object',
            properties: {}
        };

        for (const option of outputPortOptions) {
            itemSchema.properties[option.value] = option.schema;
        }

        // Validate the full output
        const deepIssues = validateDeep(actualOutput, itemSchema, '');

        if (deepIssues.length > 0) {
            warnings.push({
                field: 'output',
                message: 'Schema structure mismatches found',
                issues: deepIssues
            });
        }
    }

    return {
        valid: errors.length === 0 && warnings.length === 0,
        errors,
        warnings,
        schema,
        actualOutput
    };
}

/**
 * Checks for schema mismatches between declared item schema and actual data.
 * This is useful for detecting missing fields or type mismatches.
 *
 * @param {Object} declaredSchema - Schema defined in component (e.g., FindDocuments schema)
 * @param {Object} actualItem - Actual item from API response
 * @returns {Object} Mismatch report
 */
function findSchemaMismatches(declaredSchema, actualItem) {
    const mismatches = {
        missingInSchema: [],    // Fields in actual data but not in schema
        missingInData: [],      // Fields in schema but not in actual data
        typeMismatches: []      // Fields with wrong types
    };

    const declaredFields = Object.keys(declaredSchema);
    const actualFields = Object.keys(actualItem);

    // Find fields in actual data not declared in schema
    for (const field of actualFields) {
        if (!declaredFields.includes(field) && field !== 'index' && field !== 'count') {
            mismatches.missingInSchema.push(field);
        }
    }

    // Find fields declared but missing in actual data
    for (const field of declaredFields) {
        if (!actualFields.includes(field)) {
            mismatches.missingInData.push(field);
        }
    }

    // Check type mismatches
    for (const field of declaredFields) {
        if (actualItem[field] !== undefined) {
            const expectedType = declaredSchema[field].type;
            const actualType = typeof actualItem[field];
            const actualValue = actualItem[field];

            // Handle null values
            if (actualValue === null) continue;

            // Map JS types to JSON Schema types
            const typeMap = {
                'string': 'string',
                'number': 'number',
                'boolean': 'boolean',
                'object': actualValue instanceof Array ? 'array' : 'object'
            };

            const mappedType = typeMap[actualType];
            if (mappedType !== expectedType && expectedType !== 'any') {
                mismatches.typeMismatches.push({
                    field,
                    expected: expectedType,
                    actual: mappedType,
                    value: actualValue
                });
            }
        }
    }

    return mismatches;
}

/**
 * Main validation function for testing a Find/List component.
 *
 * Usage in tests:
 * ```javascript
 * const validator = require('./validate-output-schema');
 *
 * // Test each outputType
 * for (const outputType of ['first', 'array', 'object', 'file']) {
 *     const schemaResult = await testComponent(componentPath, {
 *         generateOutputPortOptions: true,
 *         outputType
 *     });
 *
 *     const dataResult = await testComponent(componentPath, {
 *         outputType
 *     });
 *
 *     const validation = validator.validateOutput({
 *         actualOutput: dataResult,
 *         outputPortOptions: schemaResult,
 *         outputType
 *     });
 *
 *     assert(validation.valid, `Schema mismatch for ${outputType}: ${JSON.stringify(validation.errors)}`);
 * }
 * ```
 */

module.exports = {
    convertOutputOptionsToSchema,
    validateOutput,
    findSchemaMismatches,

    /**
     * Helper to extract the first item from component output for schema comparison.
     */
    extractFirstItem(output, outputType) {
        if (outputType === 'array') {
            return output.result?.[0];
        }
        if (outputType === 'file') {
            return output;
        }
        // first or object - output is the item itself
        const { index, count, ...item } = output;
        return item;
    },

    /**
     * Generate a test report for a component.
     */
    generateReport(componentName, results) {
        const report = {
            component: componentName,
            timestamp: new Date().toISOString(),
            results: []
        };

        for (const [outputType, result] of Object.entries(results)) {
            report.results.push({
                outputType,
                valid: result.valid,
                errors: result.errors,
                mismatches: result.mismatches
            });
        }

        return report;
    }
};
