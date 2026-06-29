'use strict';

const lib = require('../../lib.generated');

const schema = {
    id: { type: 'string', title: 'Subscription ID' },
    object: { type: 'string', title: 'Object Type' },
    customer: { type: 'string', title: 'Customer ID' },
    status: { type: 'string', title: 'Status' },
    currency: { type: ['string', 'null'], title: 'Currency' },
    current_period_start: { type: 'number', title: 'Current Period Start (Unix)' },
    current_period_end: { type: 'number', title: 'Current Period End (Unix)' },
    cancel_at_period_end: { type: 'boolean', title: 'Cancel At Period End' },
    canceled_at: { type: ['number', 'null'], title: 'Canceled At (Unix)' },
    start_date: { type: 'number', title: 'Start Date (Unix)' },
    latest_invoice: { type: ['string', 'null'], title: 'Latest Invoice' },
    created: { type: 'number', title: 'Created (Unix Timestamp)' },
    livemode: { type: 'boolean', title: 'Live Mode' }
};

module.exports = {
    async receive(context) {
        const { customerId, status, outputType } = context.messages.in.content;

        if (context.properties.generateOutputPortOptions) {
            return lib.getOutputPortOptions(context, outputType, schema, {
                label: 'data',
                value: 'data'
            });
        }

        const params = { limit: 100 };
        if (customerId) {
            params.customer = customerId;
        }
        if (status) {
            params.status = status;
        }

        // https://stripe.com/docs/api/subscriptions/list
        const response = await context.httpRequest({
            method: 'GET',
            url: 'https://api.stripe.com/v1/subscriptions',
            headers: {
                'Authorization': `Bearer ${context.auth.apiKey}`,
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            params
        });

        const subscriptions = response.data && response.data.data ? response.data.data : [];

        if (subscriptions.length === 0) {
            return context.sendJson({}, 'notFound');
        }

        return lib.sendArrayOutput({
            context,
            records: subscriptions,
            outputType,
            arrayPropertyValue: 'data'
        });
    }
};
