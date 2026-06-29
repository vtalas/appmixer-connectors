'use strict';

module.exports = {
    async receive(context) {

        const { subscriptionId } = context.messages.in.content;

        if (!subscriptionId) {
            throw new context.CancelError('Subscription ID is required!');
        }

        // https://stripe.com/docs/api/subscriptions/cancel
        const { data } = await context.httpRequest({
            method: 'DELETE',
            url: `https://api.stripe.com/v1/subscriptions/${subscriptionId}`,
            headers: {
                'Authorization': `Bearer ${context.auth.apiKey}`,
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        });

        return context.sendJson(data, 'out');
    }
};
