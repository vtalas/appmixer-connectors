
'use strict';

const lib = require('../../lib');
module.exports = {
    async receive(context) {

        const { transmission_id, transmission_time, cert_url, auth_algo, transmission_sig, webhook_id, webhook_event } = context.messages.in.content;

        // https://developer.paypal.com/docs/api/webhooks/v1/#verify-webhook-signature_post
        const { data } = await context.httpRequest({
            method: 'POST',
            url: 'https://api-m.sandbox.paypal.com/v1/notifications/verify-webhook-signature',
            headers: {
                'Authorization': `Bearer ${context.auth.apiToken}`
            }
        });

        return context.sendJson(data, 'out');
    }
};
