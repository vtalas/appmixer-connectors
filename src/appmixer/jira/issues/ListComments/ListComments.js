'use strict';

const commons = require('../../jira-commons');
const lib = require('../../lib.outputPortOptions');

const schema = {
    'id': { 'type': 'string', 'title': 'Id' },
    'self': { 'type': 'string', 'title': 'Self' },
    'author': {
        'type': 'object',
        'title': 'Author',
        'properties': {
            'accountId': { 'type': 'string', 'title': 'Author.Account Id' },
            'displayName': { 'type': 'string', 'title': 'Author.Display Name' },
            'emailAddress': { 'type': 'string', 'title': 'Author.Email Address' }
        }
    },
    'body': { 'type': 'object', 'title': 'Body' },
    'created': { 'type': 'string', 'title': 'Created' },
    'updated': { 'type': 'string', 'title': 'Updated' }
};

module.exports = {

    async receive(context) {

        const { profileInfo: { apiUrl }, auth } = context;
        const { id, outputType } = context.messages.in.content;

        if (context.properties.generateOutputPortOptions) {
            return lib.getOutputPortOptions(context, outputType, schema, {
                label: 'Comments',
                value: 'comments'
            });
        }

        if (!id) {
            throw new context.CancelError('Issue ID or Key is required!');
        }

        const records = await commons.pager({
            endpoint: `${apiUrl}issue/${id}/comment`,
            credentials: auth,
            key: 'comments',
            params: { maxResults: 100 }
        });

        return lib.sendArrayOutput({
            context,
            records,
            arrayPropertyValue: 'comments',
            outputType
        });
    }
};
