'use strict';

const lib = require('../../lib.generated');

module.exports = {

    async receive(context) {

        const { folder_id, recursive, ifMatch } = context.messages.in.content;

        if (!folder_id) {
            throw new context.CancelError('Folder Id is required!');
        }

        const params = {};
        if (recursive !== undefined) {
            params.recursive = recursive;
        }

        const headers = {
            'Authorization': `Bearer ${context.auth.accessToken}`
        };

        if (ifMatch) {
            headers['If-Match'] = ifMatch;
        }

        // https://developer.box.com/reference/delete-folders-id/
        await context.httpRequest({
            method: 'DELETE',
            url: `https://api.box.com/2.0/folders/${folder_id}`,
            headers: headers,
            params: params
        });

        return context.sendJson({}, 'out');
    }
};
