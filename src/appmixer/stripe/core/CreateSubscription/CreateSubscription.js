'use strict';

module.exports = {
    async receive(context) {

        const {
            customerId,
            priceId,
            quantity,
            trialPeriodDays,
            defaultPaymentMethod
        } = context.messages.in.content;

        if (!customerId) {
            throw new context.CancelError('Customer ID is required!');
        }
        if (!priceId) {
            throw new context.CancelError('Price ID is required!');
        }

        // Stripe expects the recurring items in bracket form-encoding (items[0][price]).
        const data = {
            customer: customerId,
            'items[0][price]': priceId
        };
        if (quantity) {
            data['items[0][quantity]'] = quantity;
        }
        if (trialPeriodDays) {
            data.trial_period_days = trialPeriodDays;
        }
        if (defaultPaymentMethod) {
            data.default_payment_method = defaultPaymentMethod;
        }

        // https://stripe.com/docs/api/subscriptions/create
        const { data: subscription } = await context.httpRequest({
            method: 'POST',
            url: 'https://api.stripe.com/v1/subscriptions',
            headers: {
                'Authorization': `Bearer ${context.auth.apiKey}`,
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            data
        });

        return context.sendJson(subscription, 'out');
    }
};
