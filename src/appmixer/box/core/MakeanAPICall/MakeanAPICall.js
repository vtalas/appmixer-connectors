
'use strict';

const lib = require('../../lib.generated');
module.exports = {
    async receive(context) {

        const { method, path, query, headers, body, useUploadApi } = context.messages.in.content;

        // https://developer.box.com/reference/
        const { data } = await context.httpRequest({
            method: 'GET',
            url: 'https://api.box.com/2.0/{path}',
            headers: {
                'Authorization': `Bearer ${context.auth.apiToken}`
            }
        });

        return context.sendJson(data, 'out');
    }
};
