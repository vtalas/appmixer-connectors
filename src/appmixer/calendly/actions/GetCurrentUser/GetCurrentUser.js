'use strict';

/**
 * Get the currently authenticated Calendly user.
 * @extends {Component}
 */
module.exports = {

    async receive(context) {

        const { accessToken } = context.auth;

        const { data } = await context.httpRequest({
            method: 'GET',
            url: 'https://api.calendly.com/users/me',
            headers: { 'Authorization': `Bearer ${accessToken}` }
        });

        return context.sendJson(data.resource, 'out');
    }
};
