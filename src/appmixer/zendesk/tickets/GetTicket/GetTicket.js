'use strict';

module.exports = {

    receive: async function(context) {

        const { ticketId } = context.messages.in.content;
        if (!ticketId) {
            throw new context.CancelError('Ticket ID is required');
        }

        const url = `https://${context.auth.subdomain}.zendesk.com/api/v2/tickets/${ticketId}.json`;
        const headers = {
            Authorization: 'Bearer ' + context.auth.accessToken
        };

        try {
            const { data } = await context.httpRequest({ url, method: 'GET', headers });
            return context.sendJson(data.ticket, 'out');
        } catch (err) {
            if (err.response?.status === 404) {
                return context.sendJson({ ticketId }, 'notFound');
            }
            throw err;
        }
    }
};
