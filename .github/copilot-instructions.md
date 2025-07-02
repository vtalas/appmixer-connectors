# Appmixer Development Documentation

## Overview

Appmixer is a workflow engine with a web user interface that allows end-users to create business processes using a drag-and-drop UI without writing code.

## Project Structure

```
src/
├── appmixer/           # Source code for connectors
└── examples/           # Example components (not for production)
test/
├── utils.js           # Appmixer stub for testing
└── [test files]
```

## Code Style Guidelines

- Use 4 spaces for indentation
- Add one empty line after function definitions
- Use camelCase for variable and function names
- Follow consistent formatting patterns

---

# Connectors

## Overview

Connectors are integrations with external services. Each connector contains authentication logic, service metadata, and one or more components that perform specific actions.

## Connector Structure

```
connector_name/
├── service.json       # Service metadata and description
├── auth.js           # Authentication configuration
├── bundle.json       # Bundle metadata and changelog
├── package.json      # Dependencies (optional)
├── quota.js          # Rate limiting rules (optional)
└── core/             # Default module for components
    ├── ComponentName/
    │   ├── ComponentName.js    # Component behavior/logic
    │   └── component.json      # Component configuration
    └── AnotherComponent/
        ├── AnotherComponent.js
        └── component.json
```

## Core Configuration Files

### service.json

Describes the connector service and its metadata.

```json
{
    "name": "appmixer.connectorname",
    "label": "Connector Display Name",
    "category": "applications",
    "description": "Description of what this connector does",
    "version": "1.0.0",
    "icon": "https://example.com/icon.svg"
}
```

JSON schema of `service.json`:

```json
{
    "type": "object",
    "description": "Service JSON file, used to describe the service",
    "properties": {
        "name": {
            "type": "string",
            "description": "The name of the service, lower case, use the `appmixer.${CONNECTOR_NAME}` format "
        },
        "label": {
            "type": "string",
            "description": "The label of the service"
        },
        "category": {
            "type": "string",
            "description": "use default value 'applications'"
        },
        "description": {
            "type": "string",
            "description": "Description of the service, used in the UI to describe the connector."
        },
        "version": {
            "type": "string",
            "description": "Semantic version (e.g., 1.0.0)"
        },
        "icon": {
            "type": "string",
            "description": "url to the SVG icon of the application"
        }
    }
}
```
### bundle.json

Contains bundle metadata and version history.

```json
{
    "name": "appmixer.connectorname",
    "version": "1.0.0",
    "changelog": {
        "1.0.0": ["Initial release"],
        "1.0.1": ["Bug fixes and improvements"],
        "2.0.0": ["(breaking change) Updated API integration"]
    }
}
```

### quota.js (Optional)

Defines rate limiting rules to prevent API quota violations.

```javascript
module.exports = {
    rules: [
        {
            limit: 2000,                          // Max calls per window
            throttling: 'window-sliding',         // Throttling method
            window: 1000 * 60 * 60 * 24,        // 24 hours in ms
            scope: 'userId',                      // Per user limits
            resource: 'messages.send'             // Resource identifier
        },
        {
            limit: 3,
            window: 1000,                         // 1 second
            throttling: 'window-sliding',
            queueing: 'fifo',
            resource: 'messages.send',
            scope: 'userId'
        }
    ]
};
```

---

# Authentication

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
                },
                json: true
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

---

# Components

## Overview

Components are the building blocks of workflows. Each component performs a specific action like sending an email, creating a task, or fetching data.

## Component Structure

Each component consists of:
- `component.json` - Configuration and metadata
- `ComponentName.js` - Behavior and logic

## component.json Configuration

### Basic Structure

```json
{
    "name": "appmixer.connector.core.ComponentName",
    "label": "Component Display Name",
    "description": "What this component does",
    "author": "Appmixer <info@appmixer.com>",
    "version": "1.0.0",
    "icon": "https://example.com/icon.svg",
    
    "trigger": false,
    "tick": false,
    "webhook": false,
    
    "auth": {
        "service": "appmixer:connector",
        "scope": ["required", "permissions"]
    },
    
    "inPorts": [...],
    "outPorts": [...],
    "properties": {...}
}
```

### Key Properties

- `name`: Format `appmixer.{connector}.{module}.{ComponentName}`
- `label`: Human-readable name shown in UI
- `description`: Detailed description for users
- `trigger`: Set to `true` for trigger components (no input ports)
- `tick`: Set to `true` for components that need periodic polling
- `webhook`: Set to `true` for webhook-based components
- `auth`: Authentication service configuration

### Input Ports (inPorts)

Define what data the component accepts.

```json
{
    "inPorts": [
        {
            "name": "in",
            "schema": {
                "type": "object",
                "properties": {
                    "message": {
                        "type": "string",
                        "title": "Message"
                    },
                    "priority": {
                        "type": "string",
                        "enum": ["low", "medium", "high"],
                        "title": "Priority"
                    },
                    "count": {
                        "type": "integer",
                        "minimum": 1,
                        "title": "Count"
                    }
                },
                "required": ["message"]
            },
            "inspector": {
                "inputs": {
                    "message": {
                        "type": "textarea",
                        "index": 1,
                        "tooltip": "Enter your message here"
                    },
                    "priority": {
                        "type": "select",
                        "index": 2,
                        "options": [
                            {"label": "Low Priority", "value": "low"},
                            {"label": "Medium Priority", "value": "medium"},
                            {"label": "High Priority", "value": "high"}
                        ]
                    },
                    "count": {
                        "type": "number",
                        "index": 3,
                        "placeholder": "Enter number"
                    }
                }
            }
        }
    ]
}
```

### Output Ports (outPorts)

Define what data the component produces.

```json
{
    "outPorts": [
        {
            "name": "out",
            "options": [
                {"label": "Message ID", "value": "id"},
                {"label": "Message Text", "value": "text"},
                {"label": "Created Date", "value": "createdAt"},
                {"label": "Full Response", "value": "*"}
            ]
        }
    ]
}
```

### Adding New Fields

When adding a new field to a component:

1. **Add to schema** - Define the field type and validation
2. **Add to inspector** - Define how it appears in the UI
3. **Update behavior** - Use the field in your JavaScript code

Example of adding a `itemCount` number field:

```json
{
    "schema": {
        "properties": {
            "itemCount": {
                "type": "integer",
                "minimum": 1,
                "title": "Item Count"
            }
        }
    },
    "inspector": {
        "inputs": {
            "itemCount": {
                "type": "number",
                "index": 3,
                "placeholder": "Enter item count"
            }
        }
    }
}
```

## Component Behavior (JavaScript)

The behavior file contains the component's logic.

### Basic Structure

```javascript
module.exports = {
    async receive(context) {
        
        // Get input data
        const { message, priority, count } = context.messages.in;
        
        // Perform the action
        const response = await context.httpRequest({
            method: 'POST',
            url: 'https://api.service.com/messages',
            headers: {
                'Authorization': `Bearer ${context.auth.accessToken}`,
                'Content-Type': 'application/json'
            },
            data: {
                text: message,
                priority: priority,
                count: count
            }
        });

        // Return the result
        return context.sendJson(response.data, 'out');
    }
};
```

### Key Methods

- `context.messages.in` - Access input data
- `context.auth` - Access authentication credentials
- `context.httpRequest()` - Make HTTP requests
- `context.sendJson(data, port)` - Send data to output port
- `context.log()` - Log messages for debugging

### Advanced Features

#### Trigger Components

```javascript
module.exports = {
    async tick(context) {
        // Called periodically for polling
        const newItems = await fetchNewItems(context);
        
        for (const item of newItems) {
            await context.sendJson(item, 'out');
        }
    }
};
```

#### Webhook Components

```javascript
module.exports = {
    async receive(context) {
        const webhookUrl = context.getWebhookUrl();
        
        // Register webhook with external service
        await registerWebhook(context, webhookUrl);
        
        return context.sendJson({ webhookUrl }, 'out');
    },
    
    async webhook(context) {
        // Handle incoming webhook
        const payload = context.messages.webhook;
        return context.sendJson(payload, 'out');
    }
};
```

---

# Testing

## Overview

Appmixer provides testing utilities to verify connector and component functionality.

## Available Test Commands

### Run All Tests
```javascript
// Test all connectors and components
await runAllTests(timeout);
```

### Test Specific Connector
```javascript
// Test entire connector
await runConnectorTests('connectorname', timeout);
```

### Test Specific Component
```javascript
// Test single component
await runComponentTests('ComponentName', 'connectorname', timeout);
```

## Test Structure

Tests should be placed in the `test/` directory and use the utilities provided in `test/utils.js`.

---

# Best Practices

## Development Guidelines

1. **Validation**: Don't check required properties in behavior code - use schema validation
2. **Error Handling**: Always handle API errors gracefully
3. **Authentication**: Store sensitive data in auth configuration, not component code
4. **Rate Limiting**: Use quota.js to prevent API abuse
5. **Documentation**: Provide clear descriptions and tooltips for all fields

## Performance Considerations

1. **Caching**: Cache frequently accessed data (e.g., user lists, configuration)
2. **Pagination**: Handle large datasets with proper pagination
3. **Locking**: Use locking mechanisms for shared resources
4. **Batching**: Batch API calls when possible to reduce requests

## Common Patterns

### Dynamic Field Options

Use `source` property to populate field options dynamically:

```json
{
    "inspector": {
        "inputs": {
            "projectId": {
                "type": "select",
                "source": {
                    "url": "/component/appmixer/service/core/ListProjects?outPort=out",
                    "data": {
                        "transform": "./transformers#projectsToOptions"
                    }
                }
            }
        }
    }
}
```

### File Handling

For file input components:

```json
{
    "schema": {
        "properties": {
            "file": {
                "type": "string",
                "format": "data-url",
                "title": "File"
            }
        }
    },
    "inspector": {
        "inputs": {
            "file": {
                "type": "filepicker",
                "index": 1
            }
        }
    }
}
```

#### behavior file

JavaScript file that contains the logic of the component. It can be used to handle input and output data, call external APIs, and perform other actions. The behavior file is where the main functionality of the component is implemented.

##### `receive` function

function is called when the component receives data from the input port.

- do not check for the required properties, required properties are checked in the input schema in the component.json file.

# Code style
- Add one empty line after function definition.
- Use 4 spaces for indentation.

TODO:
- describe input file (type: filepicker)
- select input with different source component
- outputType


TODO:
- input
    - properties vs messages
- output
    - return empty response (202, 204, DELETED) - done as a prompt
    - return Appmixer file - done as a prompt
    - outputType
- main
    - pagination
    - caching (Airtable bases, HubSpot properties)
    - locking (goes in hand with caching usually, not always)

This documentation provides a comprehensive guide to developing Appmixer connectors and components with clear examples and best practices.