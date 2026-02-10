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

            // Flatten the contact object to match the expected output schema
            const flattenedContact = {
                ...data,
                'campaign.campaignId': data.campaign?.campaignId,
                'campaign.name': data.campaign?.name
            };

            return context.sendJson(flattenedContact, 'out');
        } catch (error) {
            if (error.response?.status === 404) {
                return context.sendJson({ contactId }, 'notFound');
            }
            throw error;
        }
    }
};
