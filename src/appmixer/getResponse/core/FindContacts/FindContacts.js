'use strict';

const lib = require('../../lib');

const CONTACT_SCHEMA = {
    contactId: { title: 'Contact ID', type: 'string' },
    email: { title: 'Email', type: 'string' },
    name: { title: 'Name', type: 'string' },
    'campaign.campaignId': { title: 'Campaign ID', type: 'string' },
    'campaign.name': { title: 'Campaign Name', type: 'string' },
    createdOn: { title: 'Created On', type: 'string' },
    changedOn: { title: 'Changed On', type: 'string' },
    scoring: { title: 'Scoring', type: 'number' },
    origin: { title: 'Origin', type: 'string' },
    timeZone: { title: 'Time Zone', type: 'string' },
    ipAddress: { title: 'IP Address', type: 'string' }
};

module.exports = {

    async receive(context) {

        const { generateOutputPortOptions } = context.properties;

        if (generateOutputPortOptions) {
            const { outputType } = context.messages.in.content;
            return lib.getOutputPortOptions(context, outputType, CONTACT_SCHEMA, { label: 'Contacts' });
        }

        const {
            query,
            campaignId,
            email,
            name,
            origin,
            createdOnFrom,
            createdOnTo,
            sortBy,
            sortOrder,
            outputType
        } = context.messages.in.content;

        const params = {};

        if (query) {
            params['query[name]'] = query;
        }

        if (campaignId) {
            params['query[campaignId]'] = campaignId;
        }

        if (email) {
            params['query[email]'] = email;
        }

        if (name) {
            params['query[name]'] = name;
        }

        if (origin) {
            params['query[origin]'] = origin;
        }

        if (createdOnFrom) {
            params['query[createdOn][from]'] = new Date(createdOnFrom).toISOString();
        }

        if (createdOnTo) {
            params['query[createdOn][to]'] = new Date(createdOnTo).toISOString();
        }

        if (sortBy) {
            params.sort = {};
            params.sort[sortBy] = sortOrder || 'desc';
        }

        const contacts = await lib.requestAllPages(context, {
            path: '/contacts',
            params,
            perPage: 100
        });

        // Flatten the contact objects for easier output mapping
        const flattenedContacts = contacts.map(contact => ({
            ...contact,
            'campaign.campaignId': contact.campaign?.campaignId,
            'campaign.name': contact.campaign?.name
        }));

        return lib.sendArrayOutput({
            context,
            outputPortName: 'out',
            outputType: outputType || 'array',
            records: flattenedContacts
        });
    }
};
