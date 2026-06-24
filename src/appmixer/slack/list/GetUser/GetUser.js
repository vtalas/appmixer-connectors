/* eslint-disable camelcase */
'use strict';

const { WebClient } = require('@slack/web-api');

module.exports = {

    /**
     * @link https://api.slack.com/methods/users.info
     */
    async receive(context) {

        const { userId } = context.messages.in.content;

        if (!userId) {
            throw new context.CancelError('User ID is required!');
        }

        const web = new WebClient(context.auth.accessToken);

        try {
            const response = await web.users.info({ user: userId });
            return context.sendJson(response.user, 'out');
        } catch (err) {
            if (err.data?.error === 'user_not_found') {
                return context.sendJson({ userId }, 'notFound');
            }
            throw err;
        }
    }
};
