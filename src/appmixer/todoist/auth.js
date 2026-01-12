'use strict';

module.exports = {

    type: 'oauth2',

    definition: () => {

        return {

            scope: ['data:read_write'],

            authUrl: 'https://todoist.com/oauth/authorize',

            requestAccessToken: 'https://todoist.com/oauth/access_token',

            accountNameFromProfileInfo: 'full_name',

            requestProfileInfo: async (context) => {

                const response = await context.httpRequest({
                    method: 'GET',
                    url: 'https://api.todoist.com/rest/v2/user',
                    headers: {
                        'Authorization': `Bearer ${context.accessToken}`,
                        'Content-Type': 'application/json'
                    }
                });

                return response.data;
            },

            validateAccessToken: async (context) => {

                const response = await context.httpRequest({
                    method: 'GET',
                    url: 'https://api.todoist.com/rest/v2/projects',
                    headers: {
                        'Authorization': `Bearer ${context.accessToken}`
                    }
                });

                // If the request succeeds, the token is valid
                return !!response.data;
            }
        };
    }
};
