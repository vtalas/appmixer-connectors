'use strict';

module.exports = {

    async receive(context) {

        const { folder_id, fields } = context.messages.in.content;

        if (!folder_id) {
            throw new context.CancelError('Folder ID is required!');
        }

        const params = {};
        if (fields) {
            params.fields = fields;
        }

        // https://developer.box.com/reference/get-folders-id/
        const { data } = await context.httpRequest({
            method: 'GET',
            url: `https://api.box.com/2.0/folders/${folder_id}`,
            headers: {
                'Authorization': `Bearer ${context.auth.accessToken}`
            },
            params
        });

        return context.sendJson(data, 'out');
    }
};
