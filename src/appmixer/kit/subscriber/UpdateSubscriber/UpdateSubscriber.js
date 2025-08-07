
'use strict';

module.exports = {
    async receive(context) {

        const { id, firstName, lastName, customFields } = context.messages.in.content;

        // Validate required input
        if (!id || !id.trim()) {
            throw new context.CancelError('Subscriber ID is required!');
        }

        const requestData = {};

        if (firstName !== undefined) {
            requestData.first_name = firstName;
        }
        if (lastName !== undefined) {
            requestData.last_name = lastName;
        }
        if (customFields && typeof customFields === 'object') {
            requestData.fields = customFields;
        }

        // https://developers.kit.com/api-reference/subscribers/update-a-subscriber
        const { data } = await context.httpRequest({
            method: 'PUT',
            url: `https://api.kit.com/v4/subscribers/${encodeURIComponent(id.trim())}`,
            headers: {
                'X-Kit-Api-Key': context.auth.apiKey,
                'Content-Type': 'application/json'
            },
            data: requestData
        });

        return context.sendJson(data.subscriber, 'out');
    }
};

