
'use strict';

const lib = require('../../lib');
module.exports = {
    async receive(context) {

        const { order_id } = context.messages.in.content;

        // https://developer.paypal.com/docs/api/orders/v2/#orders_get
        const { data } = await context.httpRequest({
            method: 'GET',
            url: 'https://api-m.sandbox.paypal.com/v2/checkout/orders/{order_id}',
            headers: {
                'Authorization': `Bearer ${context.auth.apiToken}`
            }
        });

        return context.sendJson(data, 'out');
    }
};
