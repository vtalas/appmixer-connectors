# Part 2: Authentication - API Key

## Overview

API Key authentication is used for services that provide static API keys or tokens. Users generate a key in their service account and paste it into Appmixer.

## Generic Example

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

## Real-World Example (Freshdesk)

```javascript
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
            const credentials = `${context.apiKey}:X`;
            const encoded = Buffer.from(credentials).toString('base64');
            await context.httpRequest({
                method: 'GET',
                url: `https://${context.domain}.freshdesk.com/api/v2/agents/me`,
                headers: {
                    'Authorization': `Basic ${encoded}`
                }
            });
            return true;
        }
    }
};
```

## Configuration Reference

### type
- **Value**: `'apiKey'`
- **Fixed**: Always "apiKey" for this authentication type

### definition.tokenType
- **Value**: `'authentication-token'`
- **Fixed**: Standard token type

### definition.auth
Object defining authentication fields shown to the user.

**Field Properties**:
- `type` - Input field type: `'text'`, `'password'`, `'select'`, etc.
- `name` - User-friendly label
- `tooltip` - Help text shown to user (can include HTML)
- `placeholder` (optional) - Placeholder text

**Example**:
```javascript
auth: {
    apiKey: {
        type: 'password',
        name: 'API Key',
        tooltip: 'Your secret API key'
    },
    endpoint: {
        type: 'text',
        name: 'API Endpoint',
        tooltip: 'Base URL for API calls'
    }
}
```

### definition.accountNameFromProfileInfo
- **Type**: `string` (dot-notation path)
- **Description**: Path to account name/email in profile response
- **Examples**: 
  - `'contact.email'` - nested property
  - `'email'` - top-level property
  - `'user.username'` - deeply nested

**Used for**: Displaying which account is connected in the UI

### definition.requestProfileInfo
- **Type**: `async function`
- **Context**: `{ apiKey, domain, ... }`
- **Returns**: Object with user/account information
- **Purpose**: Fetch profile info from the service
- **Must return**: Object (or error thrown on failure)

**Important**: Per development guidelines, must return either:
- Object with profile info, OR
- Object with just the obfuscated apiKey (if profile endpoint unavailable)

### definition.validate
- **Type**: `async function`
- **Context**: Same as requestProfileInfo
- **Returns**: `true` if valid, throw Error if invalid
- **Purpose**: Validate credentials with service API
- **Best practice**: Make a simple API call to verify auth works

## Field Types

Common input field types:

```javascript
auth: {
    // Text input
    domain: {
        type: 'text',
        name: 'Domain',
        placeholder: 'example.com'
    },
    
    // Password input (masked)
    apiKey: {
        type: 'password',
        name: 'API Key'
    },
    
    // Dropdown select
    region: {
        type: 'select',
        name: 'Region',
        options: [
            { label: 'US', value: 'us' },
            { label: 'EU', value: 'eu' }
        ]
    }
}
```

## Context Object

Available in `requestProfileInfo` and `validate`:

```javascript
{
    apiKey: 'user-provided-value',
    domain: 'user-provided-value',
    // ... any other fields from auth config
    
    // Helper methods
    httpRequest: async (config) => {...}  // Make HTTP requests
}
```

## Common Patterns

### Basic HTTP Authentication
```javascript
auth: {
    user: { type: 'text', name: 'Username' },
    password: { type: 'password', name: 'Password' }
}

validate: async (context) => {
    const credentials = `${context.user}:${context.password}`;
    const encoded = Buffer.from(credentials).toString('base64');
    
    await context.httpRequest({
        method: 'GET',
        url: 'https://api.service.com/me',
        headers: { 'Authorization': `Basic ${encoded}` }
    });
    
    return true;
}
```

### Bearer Token
```javascript
auth: {
    apiKey: { type: 'password', name: 'API Key' }
}

validate: async (context) => {
    await context.httpRequest({
        method: 'GET',
        url: 'https://api.service.com/v1/me',
        headers: { 'Authorization': `Bearer ${context.apiKey}` }
    });
    
    return true;
}
```

### Custom Header
```javascript
auth: {
    apiKey: { type: 'password', name: 'API Key' }
}

validate: async (context) => {
    await context.httpRequest({
        method: 'GET',
        url: 'https://api.service.com/user',
        headers: { 'X-API-Key': context.apiKey }
    });
    
    return true;
}
```

## Error Handling

If validation fails, throw an error:

```javascript
validate: async (context) => {
    try {
        await context.httpRequest({
            method: 'GET',
            url: 'https://api.service.com/me',
            headers: { 'Authorization': `Bearer ${context.apiKey}` }
        });
    } catch (error) {
        if (error.status === 401) {
            throw new Error('Invalid API Key');
        }
        throw error;
    }
    
    return true;
}
```

## Related Documentation

- **[Authentication Overview](overview.md)** - General authentication concepts
- **[OAuth 2.0 Authentication](oauth2.md)** - For OAuth2 services
- **[Development Guidelines](../05-best-practices/development-guidelines.md)** - Auth.js best practices
