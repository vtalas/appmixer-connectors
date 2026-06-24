'use strict';
const Hubspot = require('../../Hubspot');

module.exports = {

    async receive(context) {

        const { ticketId } = context.messages.in.content;

        if (!ticketId) {
            throw new context.CancelError('Ticket ID is required!');
        }

        const { auth } = context;
        const hs = new Hubspot(auth.accessToken, context.config);

        await hs.call('delete', `crm/v3/objects/tickets/${ticketId}`);

        return context.sendJson({}, 'out');
    }
};
