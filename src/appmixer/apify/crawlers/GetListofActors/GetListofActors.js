const lib = require('../../lib.generated');
const { getProperty } = require('../../lib.generated');
const schema = {
    'id': { 'type': 'string', 'title': 'Id' },
    'name': { 'type': 'string', 'title': 'Name' },
    'username': { 'type': 'string', 'title': 'Username' },
    'createdAt': { 'type': 'string', 'title': 'Created At' },
    'modifiedAt': { 'type': 'string', 'title': 'Modified At' },
    'title': { 'type': 'string', 'title': 'Title' },
    'description': { 'type': 'string', 'title': 'Description' },
    'isPublic': { 'type': 'boolean', 'title': 'Is Public' },
    'isAnonymouslyRunnable': { 'type': 'boolean', 'title': 'Is Anonymously Runnable' },
    'stats': {
        'type': 'object',
        'properties': {
            'runs': { 'type': 'number', 'title': 'Stats.Runs' },
            'lastRunStartedAt': { 'type': 'string', 'title': 'Stats.Last Run Started At' }
        },
        'title': 'Stats'
    }
};

module.exports = {
    async receive(context) {
        const { token, limit, offset, desc, my, outputType } = context.messages.in.content;

        if (context.properties.generateOutputPortOptions) {
            return lib.getOutputPortOptions(context, outputType, schema, { label: 'items', value: 'items' });
        }

        // https://docs.apify.com/api/v2#/reference/actors/actor-collection/get-list-of-actors
        const { data } = await context.httpRequest({
            method: 'GET',
            url: 'https://api.apify.com/v2/acts',
            headers: {
                'Authorization': `Bearer ${context.auth.apiToken}`
            }
        });

        const records = getProperty(data, 'data.items');

        return lib.sendArrayOutput({ context, records, outputType });
    }
};
