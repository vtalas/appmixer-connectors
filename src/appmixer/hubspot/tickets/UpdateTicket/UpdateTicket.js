'use strict';
const Hubspot = require('../../Hubspot');
const { formatTicket } = require('../ticketsCommons');

module.exports = {

    async receive(context) {

        const {
            ticketId,
            subject,
            content,
            pipeline,
            stage,
            priority,
            ownerId,
            category
        } = context.messages.in.content;

        if (!ticketId) {
            throw new context.CancelError('Ticket ID is required!');
        }

        const { auth } = context;
        const hs = new Hubspot(auth.accessToken, context.config);

        const additionalPropertiesArray = context.messages.in.content.additionalProperties?.AND || [];
        const additionalProperties = additionalPropertiesArray.reduce((acc, field) => {
            acc[field.name] = field.value;
            return acc;
        }, {});

        const properties = {
            ...(subject !== undefined ? { subject } : {}),
            ...(content !== undefined ? { content } : {}),
            ...(pipeline ? { hs_pipeline: pipeline } : {}),
            ...(stage ? { hs_pipeline_stage: stage } : {}),
            ...(priority ? { hs_ticket_priority: priority } : {}),
            ...(ownerId ? { hubspot_owner_id: ownerId } : {}),
            ...(category ? { hs_ticket_category: category } : {}),
            ...additionalProperties
        };

        const { data } = await hs.call('patch', `crm/v3/objects/tickets/${ticketId}`, { properties });

        return context.sendJson(formatTicket(data), 'ticket');
    }
};
