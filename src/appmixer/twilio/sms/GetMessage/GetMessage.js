'use strict';
const twilio = require('twilio');

module.exports = {

    receive(context) {

        const { accountSID, authenticationToken } = context.auth;
        const { messageSid } = context.messages.in.content;

        if (!messageSid) {
            throw new context.CancelError('Message SID is required');
        }

        const client = twilio(accountSID, authenticationToken);

        return client.messages(messageSid).fetch()
            .then(message => context.sendJson(message, 'out'));
    }
};
