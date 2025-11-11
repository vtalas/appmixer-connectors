'use strict';

module.exports = {
    async receive(context) {

        const { order_id, paypal_request_id, note_to_payer, payment_source } = context.messages.in.content;

        if (!order_id) {
            throw new context.CancelError('Order ID is required!');
        }

        // Get client credentials and environment from auth
        const { clientId, clientSecret, environment } = context.auth;
        const baseUrl = environment === 'live' ? 'https://api.paypal.com' : 'https://api.sandbox.paypal.com';

        // Get access token
        const tokenResponse = await context.httpRequest({
            method: 'POST',
            url: `${baseUrl}/v1/oauth2/token`,
            headers: {
                'Accept': 'application/json',
                'Accept-Language': 'en_US',
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            auth: {
                username: clientId,
                password: clientSecret
            },
            data: 'grant_type=client_credentials'
        });

        const accessToken = tokenResponse.data.access_token;
        if (!accessToken) {
            throw new context.CancelError('Could not obtain PayPal access token.');
        }

        // Build request body
        const requestBody = {};
        if (paypal_request_id) {
            requestBody.paypal_request_id = paypal_request_id;
        }
        if (note_to_payer) {
            requestBody.note_to_payer = note_to_payer;
        }
        if (payment_source) {
            requestBody.payment_source = payment_source;
        }

        // Capture the order
        // https://developer.paypal.com/docs/api/orders/v2/#orders_capture
        const { data } = await context.httpRequest({
            method: 'POST',
            url: `${baseUrl}/v2/checkout/orders/${order_id}/capture`,
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
                'PayPal-Auth-Assertion': '',
                'Prefer': 'return=representation'
            },
            data: requestBody
        });

        return context.sendJson(data, 'out');
    }
};
