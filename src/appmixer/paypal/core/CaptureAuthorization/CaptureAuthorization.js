'use strict';

const lib = require('../../lib');

module.exports = {
    async receive(context) {
        const {
            authorizationId,
            amountCurrencyCode,
            amountValue,
            invoiceId,
            noteToPayer,
            finalCapture,
            paypalRequestId
        } = context.messages.in.content;

        // Validate required inputs
        if (!authorizationId) {
            throw new context.CancelError('Authorization ID is required!');
        }

        // Get the base URL from auth context
        const baseUrl = context.auth.environment === 'live'
            ? 'https://api-m.paypal.com'
            : 'https://api-m.sandbox.paypal.com';

        // Get access token using client credentials
        const tokenResponse = await context.httpRequest({
            method: 'POST',
            url: `${baseUrl}/v1/oauth2/token`,
            headers: {
                'Accept': 'application/json',
                'Accept-Language': 'en_US',
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            auth: {
                username: context.auth.clientId,
                password: context.auth.clientSecret
            },
            data: 'grant_type=client_credentials'
        });

        if (!tokenResponse.data.access_token) {
            throw new context.CancelError('Failed to obtain PayPal access token!');
        }

        const accessToken = tokenResponse.data.access_token;

        // Build the capture request body
        const captureBodyData = {
            final_capture: finalCapture || false
        };

        // Add optional fields if provided
        if (amountCurrencyCode || amountValue) {
            captureBodyData.amount = {};
            if (amountCurrencyCode) {
                captureBodyData.amount.currency_code = amountCurrencyCode;
            }
            if (amountValue) {
                captureBodyData.amount.value = amountValue;
            }
        }

        if (invoiceId) {
            captureBodyData.invoice_id = invoiceId;
        }

        if (noteToPayer) {
            captureBodyData.note_to_payer = noteToPayer;
        }

        // Build headers
        const headers = {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
        };

        if (paypalRequestId) {
            headers['PayPal-Request-Id'] = paypalRequestId;
        }

        // Capture the authorization
        const { data } = await context.httpRequest({
            method: 'POST',
            url: `${baseUrl}/v2/payments/authorizations/${authorizationId}/capture`,
            headers,
            data: captureBodyData
        });

        return context.sendJson(data, 'out');
    }
};
