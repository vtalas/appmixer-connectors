'use strict';

const lib = require('../../lib');

module.exports = {

    async receive(context) {

        const labels = await lib.apiRequest(context, '/labels');

        // Transform labels into select dropdown format
        const options = labels.map(label => ({
            label: label.name,
            value: label.id
        }));

        return context.sendJson(options, 'out');
    }
};
