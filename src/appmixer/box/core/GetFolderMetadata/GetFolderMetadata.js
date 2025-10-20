'use strict';

const lib = require('../../lib.generated');

module.exports = {

    async receive(context) {

        const { folder_id, scope, templateKey } = context.messages.in.content;

        // Validate required inputs
        if (!folder_id) {
            throw new context.CancelError('Folder Id is required!');
        }
        if (!scope) {
            throw new context.CancelError('Scope is required!');
        }
        if (!templateKey) {
            throw new context.CancelError('Template Key is required!');
        }

        // https://developer.box.com/reference/get-folders-id-metadata-id-id/
        const { data } = await context.httpRequest({
            method: 'GET',
            url: `https://api.box.com/2.0/folders/${folder_id}/metadata/${scope}/${templateKey}`,
            headers: {
                'Authorization': `Bearer ${context.auth.accessToken}`
            }
        });

        return context.sendJson(data, 'out');
    }
};
