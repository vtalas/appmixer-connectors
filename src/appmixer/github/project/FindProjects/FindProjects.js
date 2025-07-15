
'use strict';

const lib = require('../../lib.generated');
const schema = { 'id':{ 'type':'string','title':'Id' },'title':{ 'type':'string','title':'Title' },'description':{ 'type':'string','title':'Description' },'owner':{ 'type':'string','title':'Owner' } };

module.exports = {
    async receive(context) {

        const { owner, projectType, outputType } = context.messages.in.content;

        if (context.properties.generateOutputPortOptions) {
            return lib.getOutputPortOptions(context, outputType, schema, { label: 'Projects', value: 'projects' });
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
