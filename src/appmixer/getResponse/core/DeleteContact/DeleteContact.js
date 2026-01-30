'use strict';

const lib = require('../../lib');

module.exports = {

    async receive(context) {

        const { contactId, messageId, ipAddress } = context.messages.in.content;

        if (!contactId) {
            throw new context.CancelError('Contact ID is required!');
        }

        const params = {};

        if (messageId) {
            params.messageId = messageId;
        }

        if (ipAddress) {
            params.ipAddress = ipAddress;
        }

        await lib.request(context, {
            method: 'DELETE',
            path: `/contacts/${contactId}`,
            params
        });

        return context.sendJson({}, 'out');
    }
};
