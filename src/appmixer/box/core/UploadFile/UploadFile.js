
'use strict';

const lib = require('../../lib.generated');
module.exports = {
    async receive(context) {

        const { parentId, name, file } = context.messages.in.content;

        // https://developer.box.com/reference/post-files-content/
        const { data } = await context.httpRequest({
            method: 'POST',
            url: 'https://upload.box.com/api/2.0/files/content',
            headers: {
                'Authorization': `Bearer ${context.auth.apiToken}`
            }
        });

        return context.sendJson(data, 'out');
    }
};
