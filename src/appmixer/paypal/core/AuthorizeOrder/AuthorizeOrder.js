'use strict';

const lib = require('../../lib');

module.exports = {
    async receive(context) {

        const { order_id, paypal_request_id } = context.messages.in.content;

        if (!order_id) {
            throw new context.CancelError('Order Id is required!');
        }

        // Get access token
        const accessToken = await lib.getAccessToken(context);

        const { environment } = context.auth;
        const baseUrl = environment === 'live' ? 'https://api.paypal.com' : 'https://api.sandbox.paypal.com';

        // https://developer.paypal.com/docs/api/orders/v2/#orders_authorize
        const { data } = await context.httpRequest({
            method: 'POST',
            url: `${baseUrl}/v2/checkout/orders/${order_id}/authorize`,
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                ...(paypal_request_id && { 'PayPal-Request-Id': paypal_request_id })
            }
        });

        return context.sendJson(data, 'out');
    }
};
