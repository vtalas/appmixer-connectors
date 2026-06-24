'use strict';

module.exports = {

    async receive(context) {

        const { fileId, access } = context.messages.in.content;

        if (!fileId) {
            throw new context.CancelError('File ID is required!');
        }

        const sharedLink = {};
        if (access) {
            sharedLink.access = access;
        }

        // https://developer.box.com/reference/put-files-id--add-shared-link/
        const { data } = await context.httpRequest({
            method: 'PUT',
            url: `https://api.box.com/2.0/files/${fileId}`,
            headers: {
                'Authorization': `Bearer ${context.auth.accessToken}`
            },
            params: { fields: 'shared_link' },
            data: { shared_link: sharedLink }
        });

        return context.sendJson(data.shared_link, 'out');
    }
};
