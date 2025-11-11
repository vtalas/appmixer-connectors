'use strict';

module.exports = {
    async receive(context) {
        const {
            senderBatchId,
            emailSubject,
            emailMessage,
            recipientType,
            receiver,
            currency,
            value,
            note,
            senderItemId
        } = context.messages.in.content;

        // Validate required inputs
        if (!senderBatchId) {
            throw new context.CancelError('Sender Batch ID is required!');
        }
        if (!recipientType) {
            throw new context.CancelError('Recipient Type is required!');
        }
        if (!receiver) {
            throw new context.CancelError('Receiver is required!');
        }
        if (!currency) {
            throw new context.CancelError('Currency is required!');
        }
        if (!value) {
            throw new context.CancelError('Amount is required!');
        }

        // Get access token using client credentials
        const baseUrl = context.auth.environment === 'live' ? 'https://api.paypal.com' : 'https://api.sandbox.paypal.com';

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

        const accessToken = tokenResponse.data.access_token;
        if (!accessToken) {
            throw new Error('Could not obtain PayPal access token.');
        }

        // Build the payout request
        const payoutRequest = {
            sender_batch_header: {
                sender_batch_id: senderBatchId,
                email_subject: emailSubject || 'Payout Notification',
                email_message: emailMessage || 'You have received a payout!'
            },
            items: [
                {
                    recipient_type: recipientType,
                    receiver: receiver,
                    amount: {
                        currency: currency,
                        value: value
                    },
                    note: note,
                    sender_item_id: senderItemId
                }
            ]
        };

        // https://developer.paypal.com/docs/api/payments.payouts-batch/v1/#payouts_post
        const { data } = await context.httpRequest({
            method: 'POST',
            url: `${baseUrl}/v1/payments/payouts`,
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            },
            data: payoutRequest
        });

        return context.sendJson(data, 'out');
    }
};
