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

        requestProfileInfo: {
            method: 'GET',
            url: 'https://api.getresponse.com/v3/accounts',
            headers: {
                'X-Auth-Token': 'api-key {{apiKey}}',
                'Content-Type': 'application/json'
            }
        },

        validate: {
            method: 'GET',
            url: 'https://api.getresponse.com/v3/accounts',
            headers: {
                'X-Auth-Token': 'api-key {{apiKey}}',
                'Content-Type': 'application/json'
            }
        }
    }
};
