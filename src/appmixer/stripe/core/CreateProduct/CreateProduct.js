'use strict';

module.exports = {
    async receive(context) {

        const { name, description, active } = context.messages.in.content;

        if (!name) {
            throw new context.CancelError('Name is required!');
        }

        const data = { name };
        if (description) {
            data.description = description;
        }
        if (active !== undefined && active !== '') {
            data.active = active;
        }

        // https://stripe.com/docs/api/products/create
        const { data: product } = await context.httpRequest({
            method: 'POST',
            url: 'https://api.stripe.com/v1/products',
            headers: {
                'Authorization': `Bearer ${context.auth.apiKey}`,
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            data
        });

        return context.sendJson(product, 'out');
    }
};
