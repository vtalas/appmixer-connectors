
'use strict';

const lib = require('../../lib.generated');
module.exports = {
    async receive(context) {

        const { file_id, fields } = context.messages.in.content;

        // https://developer.box.com/reference/get-files-id/
        const { data } = await context.httpRequest({
            method: 'GET',
            url: 'https://api.box.com/2.0/files/{file_id}',
            headers: {
                'Authorization': `Bearer ${context.auth.apiToken}`
            }
        });

        return context.sendJson(data, 'out');
    }
};
