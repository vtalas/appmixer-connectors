'use strict';

module.exports = {

    async receive(context) {

        const { sharedLinkUrl, sharedLinkPassword } = context.messages.in.content;

        if (!sharedLinkUrl) {
            throw new context.CancelError('Shared Link URL is required.');
        }

        // Build BoxApi header value
        // Format: shared_link=[url]&shared_link_password=[password]
        let boxApiHeader = `shared_link=${encodeURIComponent(sharedLinkUrl)}`;
        if (sharedLinkPassword) {
            boxApiHeader += `&shared_link_password=${encodeURIComponent(sharedLinkPassword)}`;
        }

        // https://developer.box.com/reference/get-shared-items/
        const { data } = await context.httpRequest({
            method: 'GET',
            url: 'https://api.box.com/2.0/shared_items',
            headers: {
                'Authorization': `Bearer ${context.auth.accessToken}`,
                'BoxApi': boxApiHeader
            }
        });

        return context.sendJson(data, 'out');
    }
};
