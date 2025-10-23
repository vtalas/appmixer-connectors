'use strict';

const lib = require('../../lib.generated');

module.exports = {

    async receive(context) {

        const { file_id, fields } = context.messages.in.content;

        if (!file_id) {
            throw new context.CancelError('File ID is required!');
        }

        const params = {};

        if (fields) {
            params.fields = fields;
        }

        // https://developer.box.com/reference/get-files-id/
        const { data } = await context.httpRequest({
            method: 'GET',
            url: `https://api.box.com/2.0/files/${file_id}`,
            headers: {
                'Authorization': `Bearer ${context.auth.accessToken}`
            },
            params
        });

        return context.sendJson(data, 'out');
    }
};
