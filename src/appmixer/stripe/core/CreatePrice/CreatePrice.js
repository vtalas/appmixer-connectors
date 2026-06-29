'use strict';

module.exports = {
    async receive(context) {

        const { productId, unitAmount, currency, recurringInterval } = context.messages.in.content;

        if (!productId) {
            throw new context.CancelError('Product ID is required!');
        }
        if (unitAmount === undefined || unitAmount === null || unitAmount === '') {
            throw new context.CancelError('Unit amount is required!');
        }
        if (!currency) {
            throw new context.CancelError('Currency is required!');
        }

        const data = {
            product: productId,
            unit_amount: unitAmount,
            currency
        };

        // A recurring interval turns this into a subscription price.
        if (recurringInterval) {
            data['recurring[interval]'] = recurringInterval;
        }

        // https://stripe.com/docs/api/prices/create
        const { data: price } = await context.httpRequest({
            method: 'POST',
            url: 'https://api.stripe.com/v1/prices',
            headers: {
                'Authorization': `Bearer ${context.auth.apiKey}`,
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            data
        });

        return context.sendJson(price, 'out');
    }
};
