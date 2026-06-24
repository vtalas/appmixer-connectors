'use strict';
const Hubspot = require('../../Hubspot');
const { formatTicket } = require('../ticketsCommons');

module.exports = {

    async receive(context) {

        const {
            subject,
            content,
            pipeline,
            stage,
            priority,
            ownerId,
            category
        } = context.messages.in.content;

        if (!subject) {
            throw new context.CancelError('Subject is required!');
        }

        const { auth } = context;
        const hs = new Hubspot(auth.accessToken, context.config);

        const additionalPropertiesArray = context.messages.in.content.additionalProperties?.AND || [];
        const additionalProperties = additionalPropertiesArray.reduce((acc, field) => {
            acc[field.name] = field.value;
            return acc;
        }, {});

        const properties = {
            subject,
            content: content || '',
            hs_pipeline: pipeline || '0',
            hs_pipeline_stage: stage || '1',
            ...(priority ? { hs_ticket_priority: priority } : {}),
            ...(ownerId ? { hubspot_owner_id: ownerId } : {}),
            ...(category ? { hs_ticket_category: category } : {}),
            ...additionalProperties
        };

        const { data } = await hs.call('post', 'crm/v3/objects/tickets', { properties });

        return context.sendJson(formatTicket(data), 'ticket');
    }
};
