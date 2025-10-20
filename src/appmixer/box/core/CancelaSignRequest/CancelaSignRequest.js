
'use strict';

const lib = require('../../lib.generated');
module.exports = {
    async receive(context) {

        const { sign_request_id } = context.messages.in.content;

        // https://developer.box.com/reference/post-sign-requests-id-cancel/
        const { data } = await context.httpRequest({
            method: 'POST',
            url: 'https://api.box.com/2.0/sign_requests/{sign_request_id}/cancel',
            headers: {
                'Authorization': `Bearer ${context.auth.apiToken}`
            }
        });

        return context.sendJson(data, 'out');
    }
};
