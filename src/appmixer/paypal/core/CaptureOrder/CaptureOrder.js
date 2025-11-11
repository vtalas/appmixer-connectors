
'use strict';

const lib = require('../../lib');
module.exports = {
    async receive(context) {

        const { order_id, paypal_request_id, note_to_payer, payment_source } = context.messages.in.content;

        // https://developer.paypal.com/docs/api/orders/v2/#orders_capture
        const { data } = await context.httpRequest({
            method: 'POST',
            url: 'https://api-m.sandbox.paypal.com/v2/checkout/orders/{order_id}/capture',
            headers: {
                'Authorization': `Bearer ${context.auth.apiToken}`
            }
        });

        return context.sendJson(data, 'out');
    }
};
