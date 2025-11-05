# Part 5: Best Practices - Common Patterns

## Overview

Common patterns are reusable solutions for frequently encountered problems in connector development. These patterns save time and ensure consistency.

## Dynamic Field Options (Select Dropdowns)

### Use Case

Populate select field options dynamically based on:
- API responses
- Previous user selections
- Component properties

### Pattern: Source-Based Options

In component.json, use `source` to fetch options:

```json
{
    "inPorts": [
        {
            "name": "in",
            "schema": {
                "properties": {
                    "projectId": { "type": "string" },
                    "taskList": { "type": "string" }
                }
            },
            "inspector": {
                "inputs": {
                    "projectId": {
                        "type": "select",
                        "index": 1,
                        "source": {
                            "url": "/component/appmixer/service/core/ListProjects?outPort=out"
                        }
                    },
                    "taskList": {
                        "type": "select",
                        "index": 2,
                        "source": {
                            "url": "/component/appmixer/service/core/ListTaskLists?outPort=out",
                            "data": {
                                "properties": {
                                    "projectId": "inputs/in/projectId"
                                }
                            }
                        }
                    }
                }
            }
        }
    ]
}
```

### Pattern: Transform Function

Transform complex API responses to simple options:

```javascript
// transformers.js
module.exports = {
    projectsToOptions(data) {
        return data.projects.map(project => ({
            label: project.name,
            value: project.id
        }));
    },

    tasksToOptions(data) {
        return data.items.map(item => ({
            label: item.title,
            value: item.id,
            schema: { type: 'string' }
        }));
    }
};
```

Use in component.json:

```json
{
    "source": {
        "url": "/component/appmixer/service/core/ListProjects?outPort=out",
        "data": {
            "transform": "./transformers#projectsToOptions"
        }
    }
}
```

## Adding Fields to Existing Component

### Use Case

Extend component with new input or output field.

### Steps

1. **Update component.json schema**:
```json
{
    "inPorts": [
        {
            "name": "in",
            "schema": {
                "properties": {
                    "existingField": { "type": "string" },
                    "newField": { "type": "number" }  // Add here
                }
            },
            "inspector": {
                "inputs": {
                    "existingField": { "type": "text", "index": 1 },
                    "newField": { "type": "number", "index": 2 }  // Add here
                }
            }
        }
    ]
}
```

2. **Update component behavior**:
```javascript
async receive(context) {
    const { existingField, newField } = context.messages.in.content;

    // Validate if required
    if (newField && isNaN(newField)) {
        throw new context.CancelError('New Field must be a number!');
    }

    // Use in API call
    const payload = { existingField };
    if (newField) {
        payload.limit = newField;
    }

    const response = await context.httpRequest({
        data: payload
    });

    return context.sendJson(response.data, 'out');
}
```

## File Input/Output

### File Picker Input

```json
{
    "schema": {
        "properties": {
            "file": {
                "type": "string",
                "format": "data-url",
                "title": "File"
            }
        },
        "required": ["file"]
    },
    "inspector": {
        "inputs": {
            "file": {
                "type": "filepicker",
                "index": 1,
                "label": "Select File"
            }
        }
    }
}
```

### File Handling in Behavior

```javascript
async receive(context) {
    const { file } = context.messages.in.content;

    if (!file) {
        throw new context.CancelError('File is required!');
    }

    // file is a data-URL format: data:image/png;base64,iVBORw0KGgo...
    
    // Convert to buffer
    const [, data] = file.split(',');
    const buffer = Buffer.from(data, 'base64');

    // Upload to service
    const response = await context.httpRequest({
        method: 'POST',
        url: 'https://api.service.com/upload',
        data: buffer,
        headers: {
            'Content-Type': 'application/octet-stream'
        }
    });

    return context.sendJson(response.data, 'out');
}
```

### File Output / Save to File

```javascript
async receive(context) {
    // Generate CSV content
    const csvContent = generateCsv(data);
    const buffer = Buffer.from(csvContent, 'utf8');

    // Save file
    const saved = await context.saveFileStream(
        'export.csv',
        buffer
    );

    return context.sendJson({ fileId: saved.fileId }, 'out');
}
```

## Conditional Output Routing

### Pattern: Route to Different Ports

```javascript
module.exports = {
    async receive(context) {
        const { status } = context.messages.in.content;

        // Route based on data
        if (status === 'high') {
            return context.sendJson(data, 'urgent');
        } else if (status === 'medium') {
            return context.sendJson(data, 'normal');
        } else {
            return context.sendJson(data, 'low');
        }
    }
};
```

Component.json:

```json
{
    "outPorts": [
        { "name": "urgent" },
        { "name": "normal" },
        { "name": "low" }
    ]
}
```

## Retry Logic with Exponential Backoff

### Pattern: Automatic Retry

```javascript
async function httpRequestWithRetry(
    context,
    config,
    maxRetries = 3,
    initialDelay = 1000
) {
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
            return await context.httpRequest(config);
        } catch (error) {
            // Retry on transient errors
            if (
                error.status === 429 ||  // Rate limited
                error.status === 503 ||  // Service unavailable
                error.status >= 500      // Server error
            ) {
                if (attempt < maxRetries) {
                    const delay = initialDelay * Math.pow(2, attempt - 1);
                    await new Promise(resolve => setTimeout(resolve, delay));
                    continue;
                }
            }

            // Don't retry on client errors
            throw error;
        }
    }
}

// Usage
async receive(context) {
    const response = await httpRequestWithRetry(
        context,
        {
            method: 'GET',
            url: 'https://api.service.com/data'
        }
    );

    return context.sendJson(response.data, 'out');
}
```

## Handling Multiple Output Items

### Pattern: Send Array Items One by One

```javascript
async receive(context) {
    const items = await fetchItems(context);

    // Send each item separately
    for (let index = 0; index < items.length; index++) {
        const item = {
            ...items[index],
            index,
            count: items.length
        };
        await context.sendJson(item, 'out');
    }
}
```

Adds `index` and `count` metadata so downstream components know:
- Position in sequence
- Total items to expect

## Reference Field Resolution

### Pattern: Resolve ID to Full Object

```javascript
async receive(context) {
    const { userId } = context.messages.in.content;

    if (!userId) {
        throw new context.CancelError('User ID is required!');
    }

    // Look up full user object
    const response = await context.httpRequest({
        method: 'GET',
        url: `https://api.service.com/users/${userId}`
    });

    return context.sendJson(response.data, 'out');
}
```

Useful for downstream components that need full object data instead of just ID.

## Polling with Last-Seen Tracking

### Pattern: Efficient Polling

```javascript
module.exports = {
    async tick(context) {
        // Get last known item ID
        const { lastSeenId = 0 } = context.state || {};

        // Fetch only newer items
        const response = await context.httpRequest({
            method: 'GET',
            url: 'https://api.service.com/items',
            params: {
                since: lastSeenId,
                limit: 100,
                orderBy: 'id asc'
            }
        });

        const items = response.data.items || [];

        // Send each new item
        for (const item of items) {
            await context.sendJson(item, 'out');
        }

        // Update state
        if (items.length > 0) {
            context.state = {
                lastSeenId: items[items.length - 1].id
            };
        }
    }
};
```

## Stateful Processing

### Pattern: Track Processing State

```javascript
module.exports = {
    async receive(context) {
        // Load previous state
        const processed = context.state?.processed || new Set();

        const items = await fetchItems(context);

        const newItems = items.filter(item =>
            !processed.has(item.id)
        );

        // Process new items
        for (const item of newItems) {
            await processItem(context, item);
            processed.add(item.id);
        }

        // Save state
        context.state = {
            processed: Array.from(processed)
        };

        return context.sendJson({
            processed: newItems.length
        }, 'out');
    }
};
```

## Deduplication

### Pattern: Remove Duplicate Items

```javascript
function deduplicateBy(items, keyFn) {
    const seen = new Set();
    const result = [];

    for (const item of items) {
        const key = keyFn(item);
        if (!seen.has(key)) {
            seen.add(key);
            result.push(item);
        }
    }

    return result;
}

// Usage
async receive(context) {
    const items = await fetchItems(context);

    // Remove duplicates by ID
    const unique = deduplicateBy(items, item => item.id);

    return context.sendJson(unique, 'out');
}
```

## Batch Processing

### Pattern: Process Items in Batches

```javascript
async function processBatch(context, items, batchSize = 10) {
    const results = [];

    for (let i = 0; i < items.length; i += batchSize) {
        const batch = items.slice(i, i + batchSize);

        // Process batch
        const batchResults = await Promise.all(
            batch.map(item => processItem(context, item))
        );

        results.push(...batchResults);

        // Log progress
        context.log('info', 'Batch processed', {
            processed: i + batch.length,
            total: items.length
        });
    }

    return results;
}
```

## Nested Data Transformation

### Pattern: Flatten Nested Objects

```javascript
function flattenObject(obj, prefix = '') {
    const flattened = {};

    for (const [key, value] of Object.entries(obj)) {
        const newKey = prefix ? `${prefix}.${key}` : key;

        if (value && typeof value === 'object' && !Array.isArray(value)) {
            Object.assign(flattened, flattenObject(value, newKey));
        } else {
            flattened[newKey] = value;
        }
    }

    return flattened;
}

// Usage
const nested = {
    user: {
        profile: {
            name: 'John',
            email: 'john@example.com'
        },
        settings: {
            notifications: true
    }
};

const flat = flattenObject(nested);
// {
//   'user.profile.name': 'John',
//   'user.profile.email': 'john@example.com',
//   'user.settings.notifications': true
// }
```

## Error Categorization

### Pattern: Specific Error Handling

```javascript
class ApiError extends Error {
    constructor(message, status, retryable = false) {
        super(message);
        this.status = status;
        this.retryable = retryable;
    }
}

async receive(context) {
    try {
        const response = await context.httpRequest({ /* ... */ });
        return context.sendJson(response.data, 'out');
    } catch (error) {
        if (error.status === 401 || error.status === 403) {
            throw new context.CancelError('Authentication failed');
        }
        if (error.status === 404) {
            throw new context.CancelError('Item not found');
        }
        if (error.status >= 500) {
            throw new context.CancelError('Service unavailable');
        }
        throw error;
    }
}
```

## Related Documentation

- **[Code Style](code-style.md)** - Implementation syntax
- **[Performance](performance.md)** - Optimization techniques
- **[Development Guidelines](development-guidelines.md)** - Requirements
- **[Testing](testing.md)** - Test patterns
