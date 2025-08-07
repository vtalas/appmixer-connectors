
'use strict';

module.exports = {
    async receive(context) {

        const { id } = context.messages.in.content;

        // Validate required input
        if (!id || !id.trim()) {
            throw new context.CancelError('Subscriber ID is required!');
        }

        // https://developers.kit.com/api-reference/subscribers/get-a-subscriber
        const { data } = await context.httpRequest({
            method: 'GET',
            url: `https://api.kit.com/v4/subscribers/${encodeURIComponent(id.trim())}`,
            headers: {
                'X-Kit-Api-Key': context.auth.apiKey
            }
        });

        return context.sendJson(data.subscriber, 'out');
    }
};

