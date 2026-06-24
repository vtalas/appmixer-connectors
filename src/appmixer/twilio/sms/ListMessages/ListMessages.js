'use strict';
const twilio = require('twilio');

module.exports = {

    receive(context) {

        const { accountSID, authenticationToken } = context.auth;
        const { to, from } = context.messages.in.content;

        const client = twilio(accountSID, authenticationToken);

        const options = {};
        if (to) {
            options.to = to;
        }
        if (from) {
            options.from = from;
        }

        return client.messages.list(options)
            .then(messages => context.sendJson({ items: messages, count: messages.length }, 'out'));
    }
};
