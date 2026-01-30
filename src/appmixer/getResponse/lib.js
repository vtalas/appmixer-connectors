'use strict';

const pathModule = require('path');

const API_BASE_URL = 'https://api.getresponse.com/v3';
const DEFAULT_PREFIX = 'getresponse-export';

module.exports = {

    /**
     * Make an API request to GetResponse
     * @param {Object} context - The Appmixer context
     * @param {Object} options - Request options
     * @param {string} options.method - HTTP method
     * @param {string} options.path - API endpoint path (without base URL)
     * @param {Object} [options.data] - Request body
     * @param {Object} [options.params] - Query parameters
     * @returns {Promise<Object>} - API response
     */
    async request(context, { method, path, data, params }) {

        const url = new URL(`${API_BASE_URL}${path}`);

        if (params) {
            Object.keys(params).forEach(key => {
                if (params[key] !== undefined && params[key] !== null && params[key] !== '') {
                    url.searchParams.append(key, params[key]);
                }
            });
        }

        const options = {
            method,
            url: url.toString(),
            headers: {
                'X-Auth-Token': `api-key ${context.auth.apiKey}`,
                'Content-Type': 'application/json'
            }
        };

        if (data && (method === 'POST' || method === 'PUT' || method === 'PATCH')) {
            options.data = data;
        }

        const { data: responseData, headers } = await context.httpRequest(options);
        return { data: responseData, headers };
    },

    /**
     * Fetch all items using pagination
     * @param {Object} context - The Appmixer context
     * @param {Object} options - Request options
     * @param {string} options.path - API endpoint path
     * @param {Object} [options.params] - Query parameters
     * @param {number} [options.perPage=100] - Items per page
     * @returns {Promise<Array>} - All items
     */
    async requestAllPages(context, { path, params = {}, perPage = 100 }) {

        const allItems = [];
        let page = 1;
        let totalPages = 1;

        do {
            const { data, headers } = await this.request(context, {
                method: 'GET',
                path,
                params: { ...params, page, perPage }
            });

            if (Array.isArray(data)) {
                allItems.push(...data);
            }

            // GetResponse returns TotalPages header
            const totalPagesHeader = headers['totalpages'] || headers['TotalPages'];
            if (totalPagesHeader) {
                totalPages = parseInt(totalPagesHeader, 10);
            } else {
                // If no header, check if we got fewer items than requested
                totalPages = (data?.length || 0) < perPage ? page : page + 1;
            }

            page++;
        } while (page <= totalPages);

        return allItems;
    },

    /**
     * Send array output based on outputType
     * @param {Object} options - Options
     * @param {Object} options.context - The Appmixer context
     * @param {string} [options.outputPortName='out'] - Output port name
     * @param {string} [options.outputType='array'] - Output type: 'first', 'object', 'array', 'file'
     * @param {Array} [options.records=[]] - Records to output
     * @returns {Promise<*>}
     */
    async sendArrayOutput({
        context,
        outputPortName = 'out',
        outputType = 'array',
        records = []
    }) {

        if (outputType === 'first') {
            if (records.length === 0) {
                return context.sendJson({ query: context.messages.in?.content || {} }, 'notFound');
            }
            return context.sendJson(
                { ...records[0], index: 0, count: records.length },
                outputPortName
            );
        } else if (outputType === 'object') {
            if (records.length === 0) {
                return context.sendJson({ query: context.messages.in?.content || {} }, 'notFound');
            }
            let lastResult;
            for (let index = 0; index < records.length; index++) {
                lastResult = await context.sendJson(
                    { ...records[index], index, count: records.length },
                    outputPortName
                );
            }
            return lastResult;
        } else if (outputType === 'array') {
            if (records.length === 0) {
                return context.sendJson({ query: context.messages.in?.content || {} }, 'notFound');
            }
            return context.sendJson({ result: records, count: records.length }, outputPortName);
        } else if (outputType === 'file') {

            const csvString = this.toCsv(records);
            let buffer = Buffer.from(csvString, 'utf8');
            const componentName = context.flowDescriptor[context.componentId].label || context.componentId;
            const fileName = `${context.config.outputFilePrefix || DEFAULT_PREFIX}-${componentName}.csv`;
            const savedFile = await context.saveFileStream(pathModule.normalize(fileName), buffer);

            await context.log({ step: 'File was saved', fileName, fileId: savedFile.fileId });
            return context.sendJson({ fileId: savedFile.fileId }, outputPortName);
        } else {
            throw new context.CancelError('Unsupported outputType ' + outputType);
        }
    },

    /**
     * Get output port options based on outputType
     * @param {Object} context - The Appmixer context
     * @param {string} outputType - Output type
     * @param {Object} itemSchema - Schema for items
     * @param {Object} options - Additional options
     * @param {string} options.label - Label for array output
     * @returns {*}
     */
    getOutputPortOptions(context, outputType, itemSchema, { label }) {

        if (outputType === 'object' || outputType === 'first') {
            const options = Object.keys(itemSchema)
                .reduce((res, field) => {
                    const schema = itemSchema[field];
                    const { title: fieldLabel, ...schemaWithoutTitle } = schema;

                    res.push({
                        label: fieldLabel, value: field, schema: schemaWithoutTitle
                    });
                    return res;
                }, [{
                    label: 'Current Item Index',
                    value: 'index',
                    schema: { type: 'integer' }
                }, {
                    label: 'Items Count',
                    value: 'count',
                    schema: { type: 'integer' }
                }]);

            return context.sendJson(options, 'out');
        }

        if (outputType === 'array') {
            return context.sendJson([{
                label: 'Items Count',
                value: 'count',
                schema: { type: 'integer' }
            }, {
                label: label,
                value: 'result',
                schema: {
                    type: 'array',
                    items: {
                        type: 'object',
                        properties: itemSchema
                    }
                }
            }], 'out');
        }

        if (outputType === 'file') {
            return context.sendJson([{ label: 'File ID', value: 'fileId' }], 'out');
        }
    },

    /**
     * Convert array to CSV string
     * @param {Array} array - Array of objects
     * @returns {string} - CSV string
     */
    toCsv(array) {

        if (!array || array.length === 0) {
            return '';
        }

        const headers = Object.keys(array[0]);

        return [
            headers.join(','),
            ...array.map(items => {
                return Object.values(items).map(property => {
                    if (typeof property === 'object') {
                        return JSON.stringify(property);
                    }
                    if (typeof property === 'string' && (property.includes(',') || property.includes('"'))) {
                        return `"${property.replace(/"/g, '""')}"`;
                    }
                    return property;
                }).join(',');
            })
        ].join('\n');
    }
};
