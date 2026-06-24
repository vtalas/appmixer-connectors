'use strict';
const commons = require('../../calendly-commons');

/**
 * List the scheduled events of the authenticated user.
 * @extends {Component}
 */
module.exports = {

    async receive(context) {

        const { profileInfo: { resource } } = context.auth;
        const { status, minStartTime, maxStartTime } = context.messages.in.content;

        const params = { user: resource.uri, count: 100, sort: 'start_time:desc' };
        if (status) {
            params.status = status;
        }
        if (minStartTime) {
            params.min_start_time = minStartTime;
        }
        if (maxStartTime) {
            params.max_start_time = maxStartTime;
        }

        const items = await commons.apiGetAll(context, 'https://api.calendly.com/scheduled_events', params);

        return context.sendJson({ items, count: items.length }, 'out');
    }
};
