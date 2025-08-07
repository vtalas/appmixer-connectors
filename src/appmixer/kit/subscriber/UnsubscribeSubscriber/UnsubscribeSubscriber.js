
'use strict';

module.exports = {
    async receive(context) {

        const { id } = context.messages.in.content;

        // Validate required input
        if (!id || !id.trim()) {
            throw new context.CancelError('Subscriber ID is required!');
        }

        // https://developers.kit.com/api-reference/subscribers/unsubscribe-subscriber
        const { data } = await context.httpRequest({
            method: 'POST',
            url: `https://api.kit.com/v4/subscribers/${encodeURIComponent(id.trim())}/unsubscribe`,
            headers: {
                'X-Kit-Api-Key': context.auth.apiKey,
                'Content-Type': 'application/json'
            }
        });

        // Unsubscribe API returns empty response, so we return empty object
        return context.sendJson({}, 'out');
    }
};

