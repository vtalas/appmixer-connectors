
'use strict';

const lib = require('../../lib.generated');
module.exports = {
    async receive(context) {

        const { email, firstName, lastName, customFields } = context.messages.in.content;

        // https://developers.kit.com/api-reference/subscribers/create-a-subscriber
        const { data } = await context.httpRequest({
            method: 'POST',
            url: '/subscribers',
            headers: {
                'Authorization': `Bearer ${context.auth.apiToken}`
            }
        });

        return context.sendJson(data, 'out');
    }
};
