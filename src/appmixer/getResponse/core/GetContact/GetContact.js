'use strict';

const lib = require('../../lib');

module.exports = {

    async receive(context) {

        const { contactId, fields } = context.messages.in.content;

        if (!contactId) {
            throw new context.CancelError('Contact ID is required!');
        }

        const params = {};
        if (fields) {
            params.fields = fields;
        }

        try {
            const { data } = await lib.request(context, {
                method: 'GET',
                path: `/contacts/${contactId}`,
                params
            });

            return context.sendJson(data, 'out');
        } catch (error) {
            if (error.response?.status === 404) {
                return context.sendJson({ contactId }, 'notFound');
            }
            throw error;
        }
    }
};
