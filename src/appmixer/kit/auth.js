'use strict';

module.exports = {
    type: 'apiKey',
    definition: {
        auth: {
            apiKey: {
                type: 'text',
                name: 'API Key',
                tooltip: 'Enter your API Key.'
            }
        },

        requestProfileInfo: async (context) => {
            const response = await context.httpRequest({
                method: 'GET',
                url: 'https://api.kit.com/v4/account',
                headers: {
                    'X-Kit-Api-Key': `${context.apiKey}`
                }
            });

            return response.data;
        },

        accountNameFromProfileInfo: 'account.name',

        validate: async (context) => {
            const response = await context.httpRequest({
                method: 'GET',
                url: 'https://api.kit.com/v4/account',
                headers: {
                    'X-Kit-Api-Key': `${context.apiKey}`
                }
            });

            if (!response.data) {
                throw new Error('Authentication failed: Invalid API Key or unexpected response.');
            }
            return true;
        }
    }
};
