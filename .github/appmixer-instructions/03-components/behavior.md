# Part 3: Components - Behavior (JavaScript)

## Overview

The component behavior file implements the component's logic. It handles input processing, API calls, and output generation.

## Basic Structure

```javascript
module.exports = {
    async receive(context) {
        // Handle input and perform action
        // Return results via context.sendJson()
    }
};
```

## The receive() Method

Called when component receives input from upstream component.

### Example

```javascript
module.exports = {
    async receive(context) {
        // 1. Get input data
        const { taskId } = context.messages.in.content;
        
        // 2. Validate required inputs
        if (!taskId) {
            throw new context.CancelError('Task ID is required!');
        }
        
        // 3. Make API call
        const response = await context.httpRequest({
            method: 'GET',
            url: `https://api.service.com/tasks/${taskId}`,
            headers: {
                'Authorization': `Bearer ${context.auth.accessToken}`
            }
        });
        
        // 4. Send output
        return context.sendJson(response.data, 'out');
    }
};
```

## Context Object

Available inside `receive()`, `tick()`, and `webhook()`:

```javascript
{
    // Input data
    messages: {
        in: { content: { /* input fields */ } },
        webhook: { /* webhook payload */ }
    },
    
    // Configuration
    properties: { /* component properties */ },
    flowDescriptor: { /* workflow structure */ },
    componentId: 'unique-id',
    
    // Authentication
    auth: {
        accessToken: 'token',
        refreshToken: 'refresh',
        apiKey: 'key',
        // ... other auth fields
    },
    
    // Methods
    httpRequest: async (config) => { /* make HTTP request */ },
    sendJson: async (data, portName) => { /* send output */ },
    getWebhookUrl: () => 'https://...',
    saveFileStream: async (filename, buffer) => { /* save file */ },
    
    // Utilities
    CancelError: Error,  // Throw to stop execution
    log: (level, message, data) => { /* logging */ }
}
```

## Input Data Access

```javascript
async receive(context) {
    // Get all input
    const { fieldName1, fieldName2 } = context.messages.in.content;
    
    // Or access specific field
    const value = context.messages.in.content.fieldName1;
}
```

## Sending Output

```javascript
// Send data to output port
await context.sendJson(data, 'out');

// Send data to different port (e.g., error handling)
await context.sendJson({}, 'notFound');

// Send multiple times (for array/streaming)
for (const item of items) {
    await context.sendJson(item, 'out');
}
```

## Error Handling

```javascript
async receive(context) {
    try {
        // ... operation
    } catch (error) {
        // For expected validation errors, use CancelError
        if (!taskId) {
            throw new context.CancelError('Task ID is required!');
        }
        
        // For other errors, throw normally
        throw error;
    }
}
```

## HTTP Requests

Make API calls using `context.httpRequest()`:

```javascript
const response = await context.httpRequest({
    method: 'GET|POST|PUT|PATCH|DELETE',
    url: 'https://api.example.com/endpoint',
    headers: {
        'Authorization': `Bearer ${context.auth.accessToken}`,
        'Content-Type': 'application/json'
    },
    data: { /* request body */ },
    params: { /* query parameters */ }
});

// response.data contains parsed JSON
// response.status contains HTTP status
// response.headers contains response headers
```

## Trigger Components - tick() Method

For components with `"tick": true`:

```javascript
module.exports = {
    async tick(context) {
        // Called periodically (default every 60 seconds)
        
        // Check for new items
        const newItems = await fetchNewItems(context);
        
        // Send each new item
        for (const item of newItems) {
            await context.sendJson(item, 'out');
        }
    }
};
```

## Webhook Components - webhook() Method

For components with `"webhook": true`:

```javascript
module.exports = {
    async receive(context) {
        // Register webhook with external service
        const webhookUrl = context.getWebhookUrl();
        
        await registerWebhookWithService(
            context.auth.accessToken,
            webhookUrl
        );
        
        return context.sendJson({ webhookUrl }, 'out');
    },
    
    async webhook(context) {
        // Handle incoming webhook
        const payload = context.messages.webhook;
        
        return context.sendJson(payload, 'out');
    }
};
```

## State Management

Store state between executions using context:

```javascript
async receive(context) {
    // Get state (persisted if marked persistent in component.json)
    const lastSeenId = context.state?.lastSeenId || 0;
    
    // Fetch newer items
    const items = await fetchItemsSince(lastSeenId);
    
    // Update state
    if (items.length > 0) {
        context.state = { lastSeenId: items[items.length - 1].id };
    }
    
    return context.sendJson(items, 'out');
}
```

## Common Patterns

### Conditional Output

```javascript
async receive(context) {
    const items = await fetchItems(context);
    
    if (items.length === 0) {
        return context.sendJson({}, 'notFound');
    }
    
    return context.sendJson(items, 'out');
}
```

### Transform Data

```javascript
async receive(context) {
    const raw = await context.httpRequest({...});
    
    const transformed = {
        id: raw.data.id,
        title: raw.data.name,
        description: raw.data.desc
    };
    
    return context.sendJson(transformed, 'out');
}
```

### Required Input Validation

```javascript
async receive(context) {
    const { requiredField } = context.messages.in.content;
    
    if (!requiredField) {
        throw new context.CancelError('Required Field is required!');
    }
    
    // ... continue
}
```

## Development Guidelines

### Rules

1. **Every required input must be validated**
   ```javascript
   if (!requiredInput) {
       throw new context.CancelError('Required Input is required!');
   }
   ```

2. **Delete components must return empty object**
   ```javascript
   await context.httpRequest({ method: 'DELETE', ... });
   return context.sendJson({}, 'out');
   ```

3. **Throw CancelError for expected validation failures**
   ```javascript
   throw new context.CancelError('User-friendly error message');
   ```

### Best Practices

- Use `const` and `let`, avoid `var`
- Prefer `async/await` over `.then()`
- Add comments for complex logic
- Validate all inputs
- Handle errors gracefully
- Use meaningful variable names
- Keep receive() method focused and clear

## Logging

```javascript
// Log at different levels
context.log('info', 'Operation completed', { itemCount: 5 });
context.log('warn', 'Unusual behavior detected', { detail: 'info' });
context.log('error', 'Operation failed', { error: 'details' });
```

## Related Documentation

- **[Configuration (component.json)](configuration.md)** - Manifest structure
- **[Component Types](types/)** - Specific patterns per component type
- **[Code Style](../05-best-practices/code-style.md)** - Code formatting guidelines
- **[Testing Guidelines](../05-best-practices/testing.md)** - How to test components
