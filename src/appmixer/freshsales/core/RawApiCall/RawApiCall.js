'use strict';

const api = require('../../api');
const path = require('path');
const schemas = require('../../index');

module.exports = {

    async receive(context) {

        const { method, body } = context.messages.in.content;

        if (context.properties.generateOutputPortOptions) {
            try {

                const method = 'ConvertLead';
                let schema = addTitlesToSchema(schemas[method].outputSchema);

                return context.sendJson([{ schema }], 'out');
            } catch (e) {
                console.log(e)
                await context.log({ 'step': 'sss', m: e.message });
            }

            return
        }

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

function snakeToTitle(key) {

    return key.split('_').map(word => {
        if (word.toLowerCase() === 'id') return 'ID';
        if (word.toLowerCase() === 'url') return 'URL';
        return word.charAt(0).toUpperCase() + word.slice(1);
    }).join(' ');
}

function addTitlesToSchema(schema, keyPrefix, titlePrefix) {

    if (!schema || !schema.properties) return {};
    const properties = {};
    for (const [key, prop] of Object.entries(schema.properties)) {
        const fullKey = keyPrefix ? `${keyPrefix}.${key}` : key;
        const title = titlePrefix ? `${titlePrefix}.${snakeToTitle(key)}` : snakeToTitle(key);
        if (prop.type === 'object' && prop.properties) {
            Object.assign(properties, addTitlesToSchema(prop, fullKey, title));
        } else {
            const newProp = { type: prop.type, title };
            if (prop.items) {
                newProp.items = prop.items;
            }
            properties[fullKey] = newProp;
        }
    }

    if (!keyPrefix) {
        return { type: schema.type, properties, required: schema.required || [] };
    }
    return properties;
}
