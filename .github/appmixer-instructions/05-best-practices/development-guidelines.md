# Part 5: Best Practices - Development Guidelines

## Overview

Development guidelines define requirements and standards for creating Appmixer connectors. These rules ensure reliability, consistency, and maintainability.

## auth.js Requirements

### API Key Authentication Rules

The `requestProfileInfo` function **MUST** return either:

1. **An object with obfuscated API key** (if profile info unavailable via API):
```javascript
// When service doesn't have a profile endpoint
requestProfileInfo: async (context) => {
    return {
        apiKey: context.apiKey.substring(0, 4) + '****' + context.apiKey.substring(-4)
    };
}
```

2. **An object with profile information** (from API):
```javascript
// When service provides a profile/me endpoint
requestProfileInfo: async (context) => {
    return context.httpRequest({
        method: 'GET',
        url: `https://${context.domain}.service.com/api/v1/me`,
        auth: {
            user: context.apiKey,
            password: 'X'
        }
    });
}
```

### Why This Matters

- Prevents sensitive data exposure
- Validates authentication credentials
- Provides user-friendly account identification
- Enables account management in UI

## component.json Rules

### 1. Delete Component Requirements

Delete components **MUST**:

- Have **at least one required input** (the entity ID)
- Have exactly one output port named `out`
- Return empty object on success

```json
{
    "name": "appmixer.service.core.DeleteTask",
    "inPorts": [
        {
            "name": "in",
            "schema": {
                "type": "object",
                "properties": {
                    "taskId": { "type": "string" }
                },
                "required": ["taskId"]
            }
        }
    ],
    "outPorts": ["out"]
}
```

### 2. Update Component Requirements

Update components **MUST**:

- Have **at least one required input** (the entity ID)
- Have other inputs optional (fields to update)
- Return empty object on success

```json
{
    "name": "appmixer.service.core.UpdateTask",
    "inPorts": [
        {
            "name": "in",
            "schema": {
                "type": "object",
                "properties": {
                    "taskId": { "type": "string" },
                    "title": { "type": "string" },
                    "status": { "type": "string" }
                },
                "required": ["taskId"]
            }
        }
    ],
    "outPorts": ["out"]
}
```

### 3. Input-Output Type Mapping

Ensure `inPorts` schema types match `inspector` types:

| Schema Type | Inspector Type | Valid |
|------------|----------------|--------|
| `string` | `text` or `textarea` | ✅ |
| `integer` | `number` | ✅ |
| `boolean` | `toggle` | ✅ |
| `string` | `select` | ✅ |
| `string` | `date` | ✅ |
| `string` | `number` | ❌ |
| `integer` | `text` | ❌ |

**✅ CORRECT**:
```json
{
    "schema": {
        "properties": {
            "priority": { "type": "string" }
        }
    },
    "inspector": {
        "inputs": {
            "priority": { "type": "select" }
        }
    }
}
```

**❌ WRONG**:
```json
{
    "schema": {
        "properties": {
            "count": { "type": "integer" }
        }
    },
    "inspector": {
        "inputs": {
            "count": { "type": "text" }  // Should be 'number'
        }
    }
}
```

## Behavior File Rules

### 1. Required Input Validation

Every required input **MUST** be validated in behavior:

```javascript
// ✅ CORRECT
async receive(context) {
    const { taskId, title } = context.messages.in.content;

    if (!taskId) {
        throw new context.CancelError('Task ID is required!');
    }

    if (!title) {
        throw new context.CancelError('Title is required!');
    }

    // Continue with implementation
}

// ❌ WRONG - No validation
async receive(context) {
    const { taskId, title } = context.messages.in.content;
    
    // Use directly without validation
    const url = `https://api.service.com/tasks/${taskId}`;
}
```

### 2. Delete Component Return Value

Delete components **MUST** return empty object:

```javascript
// ✅ CORRECT
async receive(context) {
    const { taskId } = context.messages.in.content;

    if (!taskId) {
        throw new context.CancelError('Task ID is required!');
    }

    await context.httpRequest({
        method: 'DELETE',
        url: `https://api.service.com/tasks/${taskId}`
    });

    return context.sendJson({}, 'out');
}

// ❌ WRONG - Don't return deleted item
async receive(context) {
    const { taskId } = context.messages.in.content;

    const response = await context.httpRequest({
        method: 'DELETE',
        url: `https://api.service.com/tasks/${taskId}`
    });

    return context.sendJson(response.data, 'out');
}
```

### 3. Update Component Return Value

Update components **MUST** return empty object:

```javascript
// ✅ CORRECT
async receive(context) {
    const { taskId, title } = context.messages.in.content;

    if (!taskId) {
        throw new context.CancelError('Task ID is required!');
    }

    const updates = {};
    if (title) updates.title = title;

    await context.httpRequest({
        method: 'PATCH',
        url: `https://api.service.com/tasks/${taskId}`,
        data: updates
    });

    return context.sendJson({}, 'out');
}

// ❌ WRONG - Don't return updated item
async receive(context) {
    const { taskId, title } = context.messages.in.content;

    const response = await context.httpRequest({
        method: 'PATCH',
        url: `https://api.service.com/tasks/${taskId}`,
        data: { title }
    });

    return context.sendJson(response.data, 'out');
}
```

## Authentication Best Practices

### Sensitive Data Handling

1. **Never log credentials**:
```javascript
// ❌ WRONG
console.log('API Key:', context.apiKey);
context.log('info', 'Using key: ' + context.apiKey);

// ✅ CORRECT
context.log('info', 'Authentication attempt for user');
```

2. **Store credentials in auth.js**, not component code:
```javascript
// ✅ CORRECT - In auth.js
definition: {
    auth: {
        apiKey: { type: 'text', name: 'API Key' }
    }
}

// ❌ WRONG - In component
module.exports = {
    async receive(context) {
        const apiKey = 'hardcoded-key';  // Never do this
    }
}
```

3. **Use context.auth for credentials**:
```javascript
// ✅ CORRECT
async receive(context) {
    const response = await context.httpRequest({
        headers: {
            'Authorization': `Bearer ${context.auth.accessToken}`
        }
    });
}

// ❌ WRONG
async receive(context) {
    const token = context.messages.in.content.token;  // Don't pass via input
}
```

## Rate Limiting Guidelines

### Define quota.js for Limited APIs

If the service has rate limits, define quota rules:

```javascript
// quota.js
module.exports = {
    rules: [
        {
            limit: 2000,
            window: 1000 * 60 * 60 * 24,  // 24 hours
            resource: 'messages.send',
            scope: 'userId'
        },
        {
            limit: 3,
            window: 1000,  // 1 second
            resource: 'messages.send',
            queueing: 'fifo'
        }
    ]
};
```

### Reference in component.json

```json
{
    "quota": {
        "manager": "appmixer:service",
        "resources": "messages.send",
        "scope": {
            "userId": "{{userId}}"
        }
    }
}
```

## Documentation Requirements

### Write Clear Descriptions

**For components**:
```json
{
    "description": "Search for tasks based on specified criteria. This component will return a maximum of 500 records."
}
```

**For inputs**:
```json
{
    "inspector": {
        "inputs": {
            "taskId": {
                "tooltip": "The unique identifier of the task"
            }
        }
    }
}
```

### Document API Limitations

```json
{
    "description": "Fetches a list of all Google Forms. Returns a maximum of 1000 records per request."
}
```

## Error Message Standards

### User-Friendly Messages

**✅ GOOD**:
- "Task ID is required!"
- "You do not have permission to update this task"
- "Task with ID 123 not found"

**❌ POOR**:
- "Invalid input"
- "Error"
- "404"
- Technical stack traces

## Code Standards

### Use Standard Node.js

- Avoid ES6 class syntax where not needed
- Use `async/await` consistently
- Export as `module.exports = { ... }`

### Validation Patterns

```javascript
// ✅ GOOD - Validate required fields early
async receive(context) {
    const { taskId, title } = context.messages.in.content;

    // Validate immediately
    if (!taskId) throw new context.CancelError('Task ID is required!');
    if (!title) throw new context.CancelError('Title is required!');

    // Then proceed with logic
}

// ❌ POOR - Validate late or inside conditionals
async receive(context) {
    const { taskId, title } = context.messages.in.content;

    if (taskId) {
        if (title) {
            // Do work
        }
    }
}
```

## General Principles

### Golden Rule for Components

**For components that require an ID as input, there must be another component that returns the entity from which the ID can be obtained.**

Example:
- If you have `GetEmail` (takes `emailId`) → you must also have `FindEmails` (returns emails with `emailId`)
- If you have `DeleteTask` (takes `taskId`) → you must also have `ListTasks` or `FindTasks` (returns tasks with `taskId`)

This ensures users can:
1. Search/list for items
2. Get details of specific items
3. Perform operations on selected items

### Testing Requirements

All components should have corresponding unit tests:

```bash
npm run test-unit -- test/<connector_name>
```

See [Testing Guidelines](testing.md) for details.

## Related Documentation

- **[Code Style](code-style.md)** - Formatting and naming conventions
- **[Performance](performance.md)** - Optimization strategies
- **[Testing](testing.md)** - Unit testing standards
- **[Common Patterns](common-patterns.md)** - Reusable implementation patterns
