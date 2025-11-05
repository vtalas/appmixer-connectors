# Part 2: Authentication - Overview

## What is Authentication?

Authentication is how users authenticate with the external service. The `auth.js` file defines the authentication mechanism and handles credential validation.

## Supported Authentication Types

Appmixer supports multiple authentication methods:

1. **API Key Authentication** - For services using API keys or tokens
2. **OAuth 2.0 Authentication** - For services using OAuth2 flow

## How Authentication Works in Appmixer

1. User connects to the service through Appmixer UI
2. User provides authentication credentials
3. Appmixer validates credentials via the auth.js file
4. On success, credentials are stored securely
5. Components use these credentials to make API calls

## When to Use Each Method

### API Key Authentication
Use when:
- Service provides static API keys or tokens
- User can generate a key in their service account settings
- Simple token-based authentication

**Examples**: Freshdesk, Stripe, OpenAI, Slack (for simple cases)

### OAuth 2.0 Authentication
Use when:
- Service uses OAuth2 flow
- Users prefer not to share API keys directly
- Need fine-grained permission scopes
- Service requires callback URL for authentication

**Examples**: GitHub, Google, Microsoft, Dropbox, Twitter

## Authentication Flow Diagram

```
┌─────────────────────────────────────────────┐
│  User in Appmixer UI                        │
└──────────────────┬──────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────┐
│  Enter Credentials                          │
│  (API Key OR OAuth redirect)                │
└──────────────────┬──────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────┐
│  auth.js: validate() method                 │
│  - Verify credentials with service API      │
│  - Test authentication                      │
└──────────────────┬──────────────────────────┘
                   │
                   ├─── Valid ───┐
                   │             │
                   ▼             ▼
              Store safely   Show error
              in database    & retry
```

## Key Responsibilities of auth.js

1. **Define authentication fields** - What credentials users need to provide
2. **Validate credentials** - Test if credentials are valid with the external service
3. **Extract profile info** - Get user/account information from the service
4. **Handle token refresh** (OAuth2 only) - Refresh expired access tokens

## Best Practices

- Store sensitive credentials securely
- Always validate credentials before storing
- Provide clear error messages if validation fails
- Extract meaningful account information for user identification
- For OAuth2, implement token refresh for long-lived sessions

## Related Documentation

- **[API Key Authentication](api-key.md)** - For simple token-based auth
- **[OAuth 2.0 Authentication](oauth2.md)** - For OAuth2 flow
- **[Development Guidelines](../05-best-practices/development-guidelines.md)** - Auth.js best practices
