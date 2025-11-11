
'use strict';

const lib = require('../../lib');
module.exports = {
    async receive(context) {        

        const { url, event_types|name } = context.messages.in.content;


        // https://developer.paypal.com/docs/api/webhooks/v1/#webhooks_post
        const { data } = await context.httpRequest({
            method: 'POST',
            url: 'https://api-m.sandbox.paypal.com/v1/notifications/webhooks',
            headers: {
                'Authorization': `Bearer ${context.auth.apiToken}`
            }
        });
    

return context.sendJson(data, 'out');
    }
};
