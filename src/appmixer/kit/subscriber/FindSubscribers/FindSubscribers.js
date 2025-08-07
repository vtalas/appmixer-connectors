
'use strict';

const lib = require('../../lib');
const schema = {
    'id': { 'type': 'string', 'title': 'Id' },
    'email_address': { 'type': 'string', 'title': 'Email Address' },
    'first_name': { 'type': 'string', 'title': 'First Name' },
    'last_name': { 'type': 'string', 'title': 'Last Name' },
    'state': { 'type': 'string', 'title': 'Status' }
};

module.exports = {
    async receive(context) {

        const {
            status,
            emailAddress,
            createdAfter,
            createdBefore,
            updatedAfter,
            updatedBefore,
            outputType = 'array'
        } = context.messages.in.content;

        if (context.properties.generateOutputPortOptions) {
            return lib.getOutputPortOptions(context, outputType, schema, { label: 'Subscribers' });
        }

        const params = {
            per_page: 1000
        };

        // Add filter parameters if provided
        if (status && status !== 'all') {
            params.state = status;
        }
        if (emailAddress) {
            params.email_address = emailAddress;
        }
        if (createdAfter) {
            params.created_after = createdAfter;
        }
        if (createdBefore) {
            params.created_before = createdBefore;
        }
        if (updatedAfter) {
            params.updated_after = updatedAfter;
        }
        if (updatedBefore) {
            params.updated_before = updatedBefore;
        }

        // https://developers.kit.com/api-reference/subscribers/list-subscribers
        const { data } = await context.httpRequest({
            method: 'GET',
            url: 'https://api.kit.com/v4/subscribers',
            headers: {
                'X-Kit-Api-Key': context.auth.apiKey
            },
            params
        });

        return lib.sendArrayOutput({ context, records: data.subscribers || [], outputType });
    }
};

