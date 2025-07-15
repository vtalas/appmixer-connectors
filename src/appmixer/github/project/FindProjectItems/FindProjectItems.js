
'use strict';

const lib = require('../../lib.generated');
const schema = { 'id':{ 'type':'string','title':'Id' },'content':{ 'type':'string','title':'Content' },'status':{ 'type':'string','title':'Status' } };

module.exports = {
    async receive(context) {

        const { projectId, status, outputType } = context.messages.in.content;

        if (context.properties.generateOutputPortOptions) {
            return lib.getOutputPortOptions(context, outputType, schema, { label: 'Items', value: 'items' });
        }

        // https://docs.github.com/en/graphql
        const { data } = await context.httpRequest({
            method: 'POST',
            url: 'https://api.github.com/graphql',
            headers: {
                'Authorization': `Bearer ${context.auth.apiToken}`
            }
        });

        return lib.sendArrayOutput({ context, records, outputType });
    }
};
