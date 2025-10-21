
'use strict';

const lib = require('../../lib.generated');
module.exports = {
    async receive(context) {

        const { file_id, version } = context.messages.in.content;




        // https://developer.box.com/reference/get-files-id-content/
        const { data } = await context.httpRequest({
            method: 'GET',
            url: 'https://api.box.com/2.0/files/{file_id}/content',
            headers: {
                'Authorization': `Bearer ${context.auth.apiToken}`
            }
        });

        return context.sendJson(data, 'out');
    }
};
