'use strict';

module.exports = {

    type: 'apiKey',

    definition: {

        tokenType: 'authentication-token',

        accountNameFromProfileInfo: 'email',

        auth: {
            apiKey: {
                type: 'text',
                name: 'API Key',
                tooltip: 'Enter your GetResponse API key. You can find it in your GetResponse account under <i>Integrations & API > API</i>.'
            }
        },

        requestProfileInfo: async (context) => {
            const response = await context.httpRequest({
                method: 'GET',
                url: 'https://api.getresponse.com/v3/accounts',
                headers: {
                    'X-Auth-Token': `api-key ${context.apiKey}`,
                    'Content-Type': 'application/json'
                }
            });
            return response.data;
        },

        validate: async (context) => {
            await context.httpRequest({
                method: 'GET',
                url: 'https://api.getresponse.com/v3/accounts',
                headers: {
                    'X-Auth-Token': `api-key ${context.apiKey}`,
                    'Content-Type': 'application/json'
                }
            });
            return true;
        }
    }
};
