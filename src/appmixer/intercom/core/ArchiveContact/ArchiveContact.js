/* eslint-disable camelcase */
'use strict';

module.exports = {

    async receive(context) {

        const { contactId } = context.messages.in.content;

        if (!contactId) {
            throw new context.CancelError('Contact ID is required.');
        }

        // https://developers.intercom.com/docs/references/rest-api/api.intercom.io/contacts/archivecontact
        const { data } = await context.httpRequest({
            method: 'POST',
            url: `https://api.intercom.io/contacts/${contactId}/archive`,
            headers: {
                'Authorization': `Bearer ${context.auth.accessToken}`,
                'Intercom-Version': '2.14'
            }
        });

        return context.sendJson(data, 'out');
    }
};
