/* eslint-disable camelcase */
'use strict';

module.exports = {

    async receive(context) {

        const { contactId, tagName } = context.messages.in.content;

        if (!contactId) {
            throw new context.CancelError('Contact ID is required.');
        }
        if (!tagName) {
            throw new context.CancelError('Tag name is required.');
        }

        // Tagging a contact by name. If the tag does not exist yet it is created,
        // then attached to the contact in a single call.
        // https://developers.intercom.com/docs/references/rest-api/api.intercom.io/tags/createtag
        const { data } = await context.httpRequest({
            method: 'POST',
            url: 'https://api.intercom.io/tags',
            headers: {
                'Authorization': `Bearer ${context.auth.accessToken}`,
                'Intercom-Version': '2.14'
            },
            data: {
                name: tagName,
                contacts: [{ id: contactId }]
            }
        });

        return context.sendJson(data, 'out');
    }
};
