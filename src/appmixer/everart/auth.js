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
            // Replace with the actual everart API endpoint for authentication/validation
            const response = await context.httpRequest({
                method: 'GET',
                url: 'https://api.everart.io/v1/models?limt=1',
                headers: {
                    'Authorization': `Bearer ${context.apiKey}`
                }
            });
            if (!response.data) {
                throw new Error('Authentication failed: Invalid API Key or unexpected response.');
            }
            return true;
        }
    }
};
