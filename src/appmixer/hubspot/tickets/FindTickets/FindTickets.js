'use strict';
const Hubspot = require('../../Hubspot');
const commons = require('../../commons');
const { formatTicket, TICKET_SCHEMA } = require('../ticketsCommons');

// https://developers.hubspot.com/docs/api/crm/tickets

// Shape of one emitted item (`object` mode, and every entry of the array output).
const ITEM_SCHEMA = {
    type: 'object',
    properties: TICKET_SCHEMA
};

module.exports = {

    ITEM_SCHEMA,

    async receive(context) {

        const { outputType, search } = context.messages.in.content;

        if (context.properties.generateOutputPortOptions) {
            return getOutputPortOptions(context, outputType);
        }

        const { auth } = context;
        const hs = new Hubspot(auth.accessToken, context.config);

        const params = {
            properties: ['subject', 'content', 'hs_pipeline', 'hs_pipeline_stage', 'hs_ticket_priority', 'hubspot_owner_id', 'hs_ticket_category']
        };
        if (search) {
            params.query = search;
        }

        // Pagination is handled internally using the API's max page size.
        const tickets = await hs.paginatedCall('post', 'crm/v3/objects/tickets/search', params, Infinity);

        if (tickets.length === 0) {
            return context.sendJson({ query: search }, 'notFound');
        }

        return commons.sendArrayOutput({
            context,
            outputPortName: 'out',
            outputType,
            records: tickets.map(formatTicket)
        });
    }
};

const getOutputPortOptions = (context, outputType) => {

    if (outputType === 'object') {
        const options = Object.keys(ITEM_SCHEMA.properties).map(field => {
            const { title: label, ...schema } = ITEM_SCHEMA.properties[field];
            return { label, value: field, schema };
        });
        return context.sendJson(options, 'out');
    }

    if (outputType === 'array') {
        return context.sendJson([{
            label: 'Array',
            value: 'array',
            schema: { type: 'array', items: ITEM_SCHEMA }
        }], 'out');
    }

    // file
    return context.sendJson([{ label: 'File ID', value: 'fileId' }], 'out');
};
