
'use strict';

const lib = require('../../lib.generated');
module.exports = {
    async receive(context) {

        const { projectItemId } = context.messages.in.content;

        // https://docs.github.com/en/graphql
        const { data } = await context.httpRequest({
            method: 'POST',
            url: 'https://api.github.com/graphql',
            headers: {
                'Authorization': `Bearer ${context.auth.apiToken}`
            }
        });

        return context.sendJson(data, 'out');
    }
};
