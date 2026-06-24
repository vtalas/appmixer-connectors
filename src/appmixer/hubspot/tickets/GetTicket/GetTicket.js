'use strict';
const Hubspot = require('../../Hubspot');
const { formatTicket } = require('../ticketsCommons');

module.exports = {

    async receive(context) {

        const { ticketId, properties } = context.messages.in.content;

        if (!ticketId) {
            throw new context.CancelError('Ticket ID is required!');
        }

        const { auth } = context;
        const hs = new Hubspot(auth.accessToken, context.config);

        const params = {
            properties: properties || 'subject,content,hs_pipeline,hs_pipeline_stage,hs_ticket_priority,hubspot_owner_id,hs_ticket_category',
            archived: false
        };

        try {
            const { data } = await hs.call('get', `crm/v3/objects/tickets/${ticketId}`, params);
            return context.sendJson(formatTicket(data), 'ticket');
        } catch (err) {
            if (err.status === 404 || err.response?.status === 404) {
                return context.sendJson({ ticketId }, 'notFound');
            }
            throw err;
        }
    }
};
