'use strict';
const commons = require('../../calendly-commons');

/**
 * List the event types of the authenticated user.
 * @extends {Component}
 */
module.exports = {

    async receive(context) {

        const { profileInfo: { resource } } = context.auth;
        const { active } = context.messages.in.content;

        const params = { user: resource.uri, count: 100 };
        if (active !== undefined && active !== '') {
            params.active = active;
        }

        const items = await commons.apiGetAll(context, 'https://api.calendly.com/event_types', params);

        return context.sendJson({ items, count: items.length }, 'out');
    }
};
