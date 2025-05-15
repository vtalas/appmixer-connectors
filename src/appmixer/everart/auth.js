'use strict';

module.exports = {
    type: 'apiKey',
    definition: {
        auth: {
            apiKey: {
                type: 'text',
                name: 'API Key',
                tooltip: 'Log into your everart account and find your API Key.'
            }
        },

        requestProfileInfo(context) {
            const apiKey = context.apiKey;
            return {
                key: apiKey.substr(0, 3) + '...' + apiKey.substr(4)
            };
        },
        accountNameFromProfileInfo: 'key',

        async validate(context) {
            const url = 'https://api.everart.io/v1/me';
            const headers = {
                'Authorization': `Bearer ${context.apiKey}`,
                'Accept': 'application/json'
            };
            const response = await context.httpRequest({ url, method: 'GET', headers });
            if (!response.data || !response.data.id) {
                throw new Error('Invalid API Key or unexpected response from everart API.');
            }
            return true;
        }
    }
};
