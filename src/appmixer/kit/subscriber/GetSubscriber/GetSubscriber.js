
'use strict';

const lib = require('../../lib.generated');
module.exports = {
    async receive(context) {

        const { id } = context.messages.in.content;

        // https://developers.kit.com/api-reference/subscribers/get-a-subscriber
        const { data } = await context.httpRequest({
            method: 'GET',
            url: '/subscribers/{id}',
            headers: {
                'Authorization': `Bearer ${context.auth.apiToken}`
            }
        });

        return context.sendJson(data, 'out');
    }
};
