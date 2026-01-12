'use strict';

const lib = require('../../lib');

module.exports = {

    async receive(context) {

        const { labelId } = context.messages.in.content;

        if (!labelId) {
            throw new context.CancelError('Label ID is required.');
        }

        const label = await lib.apiRequest(context, `/labels/${labelId}`);

        return context.sendJson(label, 'out');
    }
};
