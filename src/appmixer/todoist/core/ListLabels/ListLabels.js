'use strict';

const lib = require('../../lib');

module.exports = {

    async receive(context) {

        const { outputType } = context.messages.in.content;

        const labels = await lib.apiRequest(context, '/labels');

        return lib.sendArrayOutput({
            context,
            outputType: outputType || 'array',
            records: labels,
            filesInfo: { filename: 'labels.json' }
        });
    }
};
