
const lib = require('../../lib.generated');
module.exports = {
    async receive(context) {
        const { organization, environment, mapName, key, ttl } = context.messages.in.content;

        // https://cloud.google.com/apigee/docs/reference/apis/apigee/rest/v1/organizations.environments.keyvaluemaps.entries/create
        const { data } = await context.httpRequest({
            method: 'POST',
            url: 'https://cloud.google.com/apigee/docs/reference/apis/apigee/rest/v1/organizations.environments.keyvaluemaps.entries/create',
            headers: {
                'Authorization': `Bearer ${context.auth.apiToken}`
            }
        });

        return context.sendJson(data, 'out');
    }
};
