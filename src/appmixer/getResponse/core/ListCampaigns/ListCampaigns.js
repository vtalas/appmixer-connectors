'use strict';

const lib = require('../../lib');

const schema = {
    'campaignId': { 'type': 'string', 'title': 'Campaign ID' },
    'name': { 'type': 'string', 'title': 'Name' },
    'description': { 'type': 'string', 'title': 'Description' },
    'createdOn': { 'type': 'string', 'title': 'Created On' }
};

module.exports = {

    async receive(context) {

        const { outputType } = context.messages.in.content;

        if (context.properties.generateOutputPortOptions) {
            return lib.getOutputPortOptions(context, outputType, schema, { label: 'Campaigns' });
        }

        const campaigns = await lib.requestAllPages(context, {
            path: '/campaigns',
            perPage: 100
        });

        return lib.sendArrayOutput({ context, outputType, records: campaigns });
    }
};
