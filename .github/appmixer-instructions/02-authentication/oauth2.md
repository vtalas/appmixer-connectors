# Part 2: Authentication - OAuth 2.0

## Overview

OAuth 2.0 authentication is used for services that support OAuth2 flow. Users authorize Appmixer to access their account without sharing their password.

## OAuth 2.0 Flow

```
1. User clicks "Connect with Service"
       ↓
2. Appmixer redirects to service login
       ↓
3. User logs in and grants permissions
       ↓
4. Service redirects back to Appmixer with auth code
       ↓
5. Appmixer exchanges code for access token
       ↓
6. Access token stored and used for API calls
       ↓
7. When token expires, Appmixer uses refresh token to get new one
```

## Generic Example

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

## Real-World Example (Google OAuth2)

```javascript
module.exports = {
    type: 'oauth2',
    definition: () => {
        return {
            clientId: initData.clientId,
            clientSecret: initData.clientSecret,
            scope: ['profile', 'email'],

            accountNameFromProfileInfo: (context) => context.profileInfo.email,
            emailFromProfileInfo: (context) => context.profileInfo.email,

            authUrl: (context) => {
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

            requestAccessToken: async (context) => {
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
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                    data
                });

                return {
                    accessToken: response.data.access_token,
                    accessTokenExpDate: new Date(Date.now() + response.data.expires_in * 1000),
                    refreshToken: response.data.refresh_token
                };
            },

            requestProfileInfo: async (context) => {
                const response = await context.httpRequest({
                    method: 'GET',
                    url: 'https://www.googleapis.com/oauth2/v2/userinfo',
                    headers: { Authorization: `Bearer ${context.accessToken}` }
                });

                if (!response.data) {
                    throw new Error('Failed to retrieve profile info');
                }

                return response.data;
            },

            refreshAccessToken: async (context) => {
                const data = {
                    client_id: initData.clientId,
                    client_secret: initData.clientSecret,
                    refresh_token: context.refreshToken,
                    grant_type: 'refresh_token'
                };

                const response = await context.httpRequest({
                    method: 'POST',
                    url: 'https://oauth2.googleapis.com/token',
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                    data
                });

                return {
                    accessToken: response.data.access_token,
                    accessTokenExpDate: new Date(Date.now() + response.data.expires_in * 1000)
                };
            },

            validateAccessToken: async (context) => {
                const response = await context.httpRequest({
                    method: 'GET',
                    url: 'https://www.googleapis.com/oauth2/v2/tokeninfo',
                    params: { access_token: context.accessToken }
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

## Configuration Reference

### type
- **Value**: `'oauth2'`
- **Fixed**: Always "oauth2" for this authentication type

### definition
- **Type**: Function that returns configuration object
- **Why function?**: Allows dynamic configuration based on environment

### clientId & clientSecret
- **Type**: `string`
- **Source**: From service OAuth2 app registration
- **Security**: Keep clientSecret secure; use environment variables

### scope
- **Type**: `array` of strings
- **Description**: OAuth2 scopes requested from user
- **Examples**: `['profile', 'email', 'user:email']`
- **Note**: Different services use different scope names

### accountNameFromProfileInfo
- **Type**: Function or string
- **Returns**: Account name/email for display
- **Example**: `(context) => context.profileInfo.email`

### emailFromProfileInfo
- **Type**: Function or string (optional)
- **Returns**: Email address from profile
- **Example**: `(context) => context.profileInfo.email`

### authUrl
- **Type**: Function
- **Input**: `context` with `callbackUrl`, `scope`, `ticket`
- **Returns**: Full OAuth2 authorization URL
- **Purpose**: URL where user logs in and grants permissions

**Context properties**:
- `callbackUrl` - Where service redirects after authorization
- `scope` - Array of requested scopes
- `ticket` - Unique request identifier (use in `state` parameter)

### requestAccessToken
- **Type**: async function
- **Input**: `context` with `authorizationCode`, `callbackUrl`, `clientId`, `clientSecret`
- **Returns**: Object with `{ accessToken, accessTokenExpDate?, refreshToken? }`
- **Purpose**: Exchange authorization code for access token

**Return properties**:
- `accessToken` - Token for API requests (required)
- `accessTokenExpDate` - When token expires (optional)
- `refreshToken` - Token to get new access token (optional)

### requestProfileInfo
- **Type**: async function
- **Input**: `context` with `accessToken`
- **Returns**: User/account profile object
- **Purpose**: Fetch user info from service

### refreshAccessToken
- **Type**: async function
- **Input**: `context` with `refreshToken`, `clientId`, `clientSecret`
- **Returns**: Object with `{ accessToken, accessTokenExpDate?, refreshToken? }`
- **Purpose**: Get new access token when current one expires
- **Only if**: Service supports refresh tokens

### validateAccessToken
- **Type**: async function
- **Input**: `context` with `accessToken`
- **Returns**: `true` if valid, throw Error if invalid
- **Purpose**: Verify token is still valid
- **Optional**: Only needed if service provides token validation endpoint

## Context Object

Available in OAuth2 methods:

```javascript
{
    clientId: 'from-config',
    clientSecret: 'from-config',
    accessToken: 'user-token',
    refreshToken: 'refresh-token',
    authorizationCode: 'from-oauth-flow',
    callbackUrl: 'appmixer-callback-url',
    scope: ['profile', 'email'],
    profileInfo: { /* user data */ },
    ticket: 'unique-request-id',
    
    // Helper methods
    httpRequest: async (config) => {...}
}
```

## OAuth2 Parameters Explained

### state
- **Purpose**: Prevents CSRF attacks
- **Value**: Unique identifier (use `context.ticket`)
- **Validation**: Must verify returned state matches request

### redirect_uri
- **Purpose**: Where service redirects after authorization
- **Value**: `context.callbackUrl` (provided by Appmixer)
- **Must match**: URI registered in service OAuth app

### access_type
- **Value**: `'offline'` for refresh token support
- **Effect**: Enables long-lived sessions with refresh token

### approval_prompt (Google specific)
- **Value**: `'force'` to always show consent screen
- **Purpose**: Ensures refresh_token is returned

## Common Scopes by Service

### GitHub
```javascript
scope: ['repo', 'user:email', 'read:user']
```

### Google
```javascript
scope: [
    'https://www.googleapis.com/auth/userinfo.profile',
    'https://www.googleapis.com/auth/userinfo.email'
]
```

### Slack
```javascript
scope: ['users:read', 'users:read.email', 'channels:read']
```

### Microsoft
```javascript
scope: ['user.read', 'mail.read', 'calendar.read']
```

## Related Documentation

- **[Authentication Overview](overview.md)** - General authentication concepts
- **[API Key Authentication](api-key.md)** - For simpler token-based auth
- **[Development Guidelines](../05-best-practices/development-guidelines.md)** - OAuth2 best practices
