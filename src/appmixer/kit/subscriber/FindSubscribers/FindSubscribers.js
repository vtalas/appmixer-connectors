
'use strict';

const lib = require('../../lib.generated');
const schema = { 'id': { 'type': 'string', 'title': 'Id' }, 'email': { 'type': 'string', 'title': 'Email' }, 'firstName': { 'type': 'string', 'title': 'First Name' }, 'lastName': { 'type': 'string', 'title': 'Last Name' }, 'status': { 'type': 'string', 'title': 'Status' }, 'createdAt': { 'type': 'string', 'title': 'Created At' } };

module.exports = {
    async receive(context) {

        const { status, outputType } = context.messages.in.content;

        if (context.properties.generateOutputPortOptions) {
            return lib.getOutputPortOptions(context, outputType, schema, { label: 'Subscribers' });
        }

        // https://developers.kit.com/api-reference/subscribers/list-subscribers
        const { data } = await context.httpRequest({
            method: 'GET',
            url: 'https://api.kit.com/v4/subscribers',
            headers: {
                'Authorization': `Bearer ${context.auth.apiToken}`
            }
        });

        return lib.sendArrayOutput({ context, records, outputType });
    }
};
