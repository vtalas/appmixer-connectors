## Overview

Appmixer supports multiple authentication methods. The `auth.js` file defines how users authenticate with the external service.

## Authentication Types

### API Key Authentication

For services that use API keys or tokens.

```javascript
module.exports = {
    type: 'apiKey',
    definition: {
        tokenType: 'authentication-token',
        
        // Authentication fields shown to user
        auth: {
            domain: {
                type: 'text',
                name: 'Domain',
                tooltip: 'Your subdomain (e.g., "example" for example.service.com)'
            },
            apiKey: {
                type: 'text',
                name: 'API Key',
                tooltip: 'Find your API key in your account settings'
            }
        },

        // How to extract account name from profile
        accountNameFromProfileInfo: 'contact.email',

        // Fetch user profile information
        requestProfileInfo: async (context) => {
            return context.httpRequest({
                method: 'GET',
                url: `https://${context.domain}.service.com/api/v1/me`,
                auth: {
                    user: context.apiKey,
                    password: 'X'
                }
            });
        },

        // Validate credentials
        validate: async (context) => {
            const credentials = `${context.apiKey}:X`;
            const encoded = Buffer.from(credentials).toString('base64');
            
            await context.httpRequest({
                method: 'GET',
                url: `https://${context.domain}.service.com/api/v1/me`,
                headers: {
                    'Authorization': `Basic ${encoded}`
                }
            });
            
            return true; // If request succeeds, credentials are valid
        }
    }
};
```

### OAuth 2.0 Authentication

For services using OAuth 2.0 flow.

```javascript
module.exports = {
    type: 'oauth2',
    definition: () => ({
        clientId: 'your-client-id',
        clientSecret: 'your-client-secret',
        scope: ['profile', 'email'],

        // Extract account info from profile
        accountNameFromProfileInfo: (context) => context.profileInfo.email,
        
        emailFromProfileInfo: (context) => context.profileInfo.email,

        // Authorization URL
        authUrl: (context) => {
            const params = new URLSearchParams({
                client_id: 'your-client-id',
                redirect_uri: context.callbackUrl,
                response_type: 'code',
                scope: context.scope.join(' '),
                state: context.ticket,
                access_type: 'offline'
            });
            return `https://service.com/oauth/authorize?${params}`;
        },

        // Exchange authorization code for access token
        requestAccessToken: async (context) => {
            const response = await context.httpRequest({
                method: 'POST',
                url: 'https://service.com/oauth/token',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                data: {
                    code: context.authorizationCode,
                    client_id: 'your-client-id',
                    client_secret: 'your-client-secret',
                    redirect_uri: context.callbackUrl,
                    grant_type: 'authorization_code'
                }
            });

            return {
                accessToken: response.data.access_token,
                accessTokenExpDate: new Date(Date.now() + response.data.expires_in * 1000),
                refreshToken: response.data.refresh_token
            };
        },

        // Get user profile
        requestProfileInfo: async (context) => {
            const response = await context.httpRequest({
                method: 'GET',
                url: 'https://service.com/api/v1/userinfo',
                headers: { Authorization: `Bearer ${context.accessToken}` }
            });
            return response.data;
        },

        // Refresh expired access token
        refreshAccessToken: async (context) => {
            const response = await context.httpRequest({
                method: 'POST',
                url: 'https://service.com/oauth/token',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                data: {
                    client_id: 'your-client-id',
                    client_secret: 'your-client-secret',
                    refresh_token: context.refreshToken,
                    grant_type: 'refresh_token'
                }
            });

            return {
                accessToken: response.data.access_token,
                accessTokenExpDate: new Date(Date.now() + response.data.expires_in * 1000)
            };
        },

        // Validate access token
        validateAccessToken: async (context) => {
            const response = await context.httpRequest({
                method: 'GET',
                url: 'https://service.com/api/v1/tokeninfo',
                params: { access_token: context.accessToken }
            });
            return !!response.data.expires_in;
        }
    })
};
```

```js
module.exports = {

    type: 'apiKey',

    definition: {

        tokenType: 'authentication-token',

        auth: {
            domain: {
                type: 'text',
                name: 'Domain',
                tooltip: 'Your Freshdesk subdomain - e.g. if the domain is <i>https://example.freshdesk.com</i> just type <b>example</b> inside this field'
            },
            apiKey: {
                type: 'text',
                name: 'API Key',
                tooltip: 'Log into your Freshdesk account and find <i>Your API Key</i> in Profile settings page.'
            }
        },

        accountNameFromProfileInfo: 'contact.email',

        requestProfileInfo: async (context) => {

            // curl https://mydomain.freshdesk.com/api/v2/agents/me \
            //  -u myApiKey:X'
            return context.httpRequest({
                method: 'GET',
                url: `https://${context.domain}.freshdesk.com/api/v2/agents/me`,
                auth: {
                    user: context.apiKey,
                    password: 'X'
                }
            });
        },

        validate: async context => {

            // curl https://mydomain.freshdesk.com/api/v2/agents/me \
            //  -u myApiKey:X'
            const credentials = `${context.apiKey}:X`;
            const encoded = (new Buffer(credentials)).toString('base64');
            await context.httpRequest({
                method: 'GET',
                url: `https://${context.domain}.freshdesk.com/api/v2/agents/me`,
                headers: {
                    'Authorization': `Basic ${encoded}`
                }
            });
            // if the request doesn't fail, return true (exception will be captured in caller)
            return true;
        }
    }
};
```

type `oauth2` example :

```js
module.exports = {

    type: 'oauth2',

    definition: () => {

        return {

            clientId: initData.clientId,
            clientSecret: initData.clientSecret,

            scope: ['profile', 'email'],

            /**
             * Works exactly the same way as described in the `apiKey` section.
             * @param context
             * @returns {*|string}
             */
            accountNameFromProfileInfo: function(context) {
                return context.profileInfo.email;
            },

            emailFromProfileInfo: function(context) {
                return context.profileInfo.email;
            },

            /**
             * Function, object or a string URL returning auth URL. Appmixer will then use this URL to redirect the user to the proper authentication page. The `requestToken` is available in the context. The example shows the authUrl declaration using the token provided by the context.
             */
            authUrl: function(context) {
                const params = new URLSearchParams({
                    client_id: initData.clientId,
                    redirect_uri: context.callbackUrl,
                    response_type: 'code',
                    scope: context.scope.join(' '),
                    state: context.ticket,
                    access_type: 'offline',
                    approval_prompt: 'force'
                }).toString();

                return `https://accounts.google.com/o/oauth2/auth?${params}`;
            },

            /**
             * This function should return a promise with an object which contains `accessToken`, `refreshToken` (optional, some OAuth 2 implementations do not have refresh tokens) and accessTokenExpDate or expires_in (also optional if the implementation does not have tokens that expire). Inside this function, you should call the endpoint which handles the access tokens for the application. The following context properties are available to you in this function: clientId, clientSecret, callbackUrl and authorizationCode.
             * @param context
             * @returns {proimise}
             */
            requestAccessToken: async function(context) {

                const data = {
                    code: context.authorizationCode,
                    client_id: initData.clientId,
                    client_secret: initData.clientSecret,
                    redirect_uri: context.callbackUrl,
                    grant_type: 'authorization_code'
                };

                const response = await context.httpRequest({
                    method: 'POST',
                    url: 'https://oauth2.googleapis.com/token',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    },
                    data
                });

                return {
                    accessToken: response.data.access_token,
                    accessTokenExpDate: new Date(Date.now() + response.data.expires_in * 1000),
                    refreshToken: response.data.refresh_token
                };
            },

            /**
             * Works exactly the same way as described in the `apiKey` section.
             * @returns {*}
             */
            requestProfileInfo: async function(context) {
                const response = await context.httpRequest({
                    method: 'GET',
                    url: 'https://www.googleapis.com/oauth2/v2/userinfo',
                    headers: {
                        Authorization: `Bearer ${context.accessToken}`
                    }
                });

                if (!response.data) {
                    throw new Error('Failed to retrieve profile info');
                }

                return response.data;
            },

            /**
             * Part of the OAuth 2 specification is the ability to refresh short-lived access tokens via a refresh token that is issued along with the access token. This function should call the refresh token endpoint on the third-party app and resolve to an object with `accessToken` and `accessTokenExpDate` (and `refreshToken` if needed) properties, as shown in the example.  You have access to context properties `clientId`, `clientSecret`, `callbackUrl` and `refreshToken`.
             * @param context
             * @returns {*}
             */
            refreshAccessToken: async function(context) {

                const data = {
                    client_id: initData.clientId,
                    client_secret: initData.clientSecret,
                    refresh_token: context.refreshToken,
                    grant_type: 'refresh_token'
                };

                const response = await context.httpRequest({
                    method: 'POST',
                    url: 'https://oauth2.googleapis.com/token',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    },
                    data
                });

                return {
                    accessToken: response.data.access_token,
                    accessTokenExpDate: new Date(Date.now() + response.data.expires_in * 1000)
                };
            },

            /**
             * This property serves the same purpose as validate property in the API Key mechanism. This is used by Appmixer to test if the access token is valid and accepted by the third-party app. You have access to context.accessToken and context.accessTokenSecret to make authenticated requests. If the token is valid, this function should resolve to any value. Otherwise, throw an error.
             * @param context
             * @returns {boolean}
             */
            validateAccessToken: async function(context) {
                const response = await context.httpRequest({
                    method: 'GET',
                    url: 'https://www.googleapis.com/oauth2/v2/tokeninfo',
                    params: {
                        access_token: context.accessToken
                    }
                });

                if (response.data.expires_in) {
                    return !!response.data.expires_in;
                }

                return false;
            }
        };
    }
};

```
