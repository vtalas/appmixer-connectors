'use strict';

const lib = require('../../lib');

module.exports = {

    async receive(context) {

        try {
            const labels = await lib.apiRequest(context, '/labels');

            // Transform labels into select dropdown format
            const options = labels.map(label => ({
                label: label.name,
                value: label.id
            }));

            return context.sendJson(options, 'out');
        } catch (err) {
            // When used as dynamic source, return empty response instead of error
            if (context.properties.variableFetch) {
                return context.sendJson([], 'out');
            }
            // When used in flow, throw error normally
            context.log({ stage: 'Error', message: err.message, code: err.code });
            throw err;
        }
    }
};
