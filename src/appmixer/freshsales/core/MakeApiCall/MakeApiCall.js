'use strict';

const api = require('../../api');
const path = require('path');

module.exports = {

    async receive(context) {

        const { method, body } = context.messages.in.content;

        if (!method) {
            throw new context.CancelError('Method is required!');
        }

        const apiMethod = api[method];
        if (!apiMethod) {
            throw new context.CancelError(`Unknown API method: ${method}`);
        }

        let parsedBody = {};
        if (body) {
            try {
                parsedBody = JSON.parse(body);
            } catch (e) {
                throw new context.CancelError('Invalid JSON in body field.');
            }
        }

        const { data } = await apiMethod.execute(context, parsedBody);
        return context.sendJson(data, 'out');
    },

    toOutputPortOptions({ method }) {

        const schemaPath = path.join(__dirname, '../../artifacts/schemas', `${method}.js`);
        try {
            const schema = require(schemaPath);
            if (schema.outputSchema && schema.outputSchema.properties) {
                return flattenSchema(schema.outputSchema.properties);
            }
        } catch (e) {
            // Schema file not found for this method
        }
        return [{ label: 'Result', value: 'data' }];
    }
};

function flattenSchema(properties, prefix) {

    const options = [];
    for (const [key, prop] of Object.entries(properties)) {
        const valuePath = prefix ? `${prefix}.${key}` : key;
        const label = prop.description || key;

        if (prop.type === 'object' && prop.properties) {
            options.push(...flattenSchema(prop.properties, valuePath));
        } else {
            options.push({ label, value: valuePath });
        }
    }
    return options;
}
