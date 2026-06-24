'use strict';

/**
 * Cancel a scheduled event.
 * @extends {Component}
 */
module.exports = {

    async receive(context) {

        const { accessToken } = context.auth;
        const { eventUri, reason } = context.messages.in.content;

        if (!eventUri) {
            throw new context.CancelError('Event URI is required');
        }

        const { data } = await context.httpRequest({
            method: 'POST',
            url: `${eventUri}/cancellation`,
            headers: { 'Authorization': `Bearer ${accessToken}` },
            data: reason ? { reason } : {}
        });

        return context.sendJson(data.resource, 'out');
    }
};
