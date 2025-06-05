
const lib = require('../../lib.generated');
module.exports = {
    async receive(context) {
        const { organization, environment, mapName, key } = context.messages.in.content;

        // https://cloud.google.com/apigee/docs/reference/apis/apigee/rest/v1/organizations.environments.keyvaluemaps.entries/create
        const { data } = await context.httpRequest({
            method: 'DELETE',
            url: 'https://cloud.google.com/apigee/docs/reference/apis/apigee/rest/v1/organizations.environments.keyvaluemaps.entries/create',
            headers: {
                'Authorization': `Bearer ${context.auth.apiToken}`
            }
        });

        return context.sendJson(data, 'out');
    }
};
