'use strict';

module.exports = {

    type: 'oauth2',

    definition: () => {

        return {

            scope: ['data:read_write'],

            authUrl: 'https://todoist.com/oauth/authorize',

            requestAccessToken: 'https://todoist.com/oauth/access_token',

            requestProfileInfo: {
                method: 'GET',
                url: 'https://api.todoist.com/sync/v9/sync',
                headers: {
                    'Authorization': 'Bearer {{accessToken}}'
                },
                body: {
                    sync_token: '*',
                    resource_types: '["user"]'
                }
            },

            accountNameFromProfileInfo: 'user.full_name',

            validateAccessToken: {
                method: 'GET',
                url: 'https://api.todoist.com/rest/v2/projects',
                headers: {
                    'Authorization': 'Bearer {{accessToken}}'
                }
            }
        };
    }
};
