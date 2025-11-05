# Part 3: Component Types - Trigger Components

## Overview

Trigger components monitor for events and start workflows when conditions are met. They use polling (tick) or webhooks to detect changes in the external service.

## Two Trigger Types

### 1. Polling Triggers (tick-based)

Check for new items at regular intervals.

```json
{
    "trigger": true,
    "tick": true
}
```

### 2. Webhook Triggers

Listen for real-time events from external service.

```json
{
    "trigger": true,
    "webhook": true
}
```

## Common Trigger Patterns

### New {EntityName} / {EntityName} Created

Triggers when new items are created.

**Pattern**: `New{EntityName}` or `{EntityName}Created`
- e.g., `NewTask`, `TaskCreated`, `NewUser`

**Example component.json**:
```json
{
    "name": "appmixer.service.core.NewTask",
    "label": "New Task",
    "description": "Triggers when a new task is created",
    "author": "Appmixer <info@appmixer.com>",
    "version": "1.0.0",
    "auth": {
        "service": "appmixer:service"
    },
    "trigger": true,
    "tick": true,
    "outPorts": [
        {
            "name": "out",
            "options": [
                { "label": "Task ID", "value": "id" },
                { "label": "Title", "value": "title" },
                { "label": "Status", "value": "status" },
                { "label": "Created Date", "value": "created_at" }
            ]
        }
    ]
}
```

### {EntityName} Updated

Triggers when items are modified.

**Pattern**: `{EntityName}Updated`
- e.g., `TaskUpdated`, `UserUpdated`

### {EntityName} Deleted

Triggers when items are removed.

**Pattern**: `{EntityName}Deleted`
- e.g., `TaskDeleted`, `UserDeleted`

## Polling Trigger Implementation

```javascript
'use strict';

module.exports = {

    async tick(context) {
        // Get last known ID from state
        const lastSeenId = context.state?.lastSeenId || 0;

        // Fetch new items
        const response = await context.httpRequest({
            method: 'GET',
            url: 'https://api.service.com/tasks',
            headers: {
                'Authorization': `Bearer ${context.auth.accessToken}`
            },
            params: {
                since: lastSeenId,
                limit: 100,
                orderBy: 'created_at asc'
            }
        });

        const newTasks = response.data.items || [];

        // Send each new item
        for (const task of newTasks) {
            await context.sendJson(task, 'out');

            // Update state after each item
            context.state = { lastSeenId: task.id };
        }
    }
};
```

## Webhook Trigger Implementation

```javascript
'use strict';

module.exports = {

    async receive(context) {
        // Called once to register the webhook
        const webhookUrl = context.getWebhookUrl();

        // Register webhook with service
        await registerWebhookWithService(
            context.auth.accessToken,
            webhookUrl
        );

        return context.sendJson({ webhookUrl }, 'out');
    },

    async webhook(context) {
        // Called when external service sends event
        const payload = context.messages.webhook;

        // Transform payload if needed
        const task = {
            id: payload.task_id,
            title: payload.task_name,
            status: payload.current_status,
            created_at: payload.created_timestamp
        };

        return context.sendJson(task, 'out');
    }
};

async function registerWebhookWithService(accessToken, webhookUrl) {
    // Implementation depends on the service API
    // Example:
    const response = await fetch('https://api.service.com/webhooks', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            url: webhookUrl,
            events: ['task.created', 'task.updated', 'task.deleted']
        })
    });

    if (!response.ok) {
        throw new Error('Failed to register webhook');
    }

    return response.json();
}
```

## State Management in Triggers

Triggers often store state to track progress:

```javascript
async tick(context) {
    // Get previous state
    const { lastCheckedTime, lastSeenId } = context.state || {};

    // Fetch new items since last check
    const response = await context.httpRequest({
        method: 'GET',
        url: 'https://api.service.com/tasks',
        params: {
            modifiedAfter: lastCheckedTime || new Date(0),
            limit: 100
        }
    });

    const items = response.data.items || [];

    // Send each item
    for (const item of items) {
        await context.sendJson(item, 'out');
    }

    // Update state
    if (items.length > 0) {
        context.state = {
            lastCheckedTime: new Date().toISOString(),
            lastSeenId: items[items.length - 1].id
        };
    }
}
```

## Polling vs Webhook Comparison

| Aspect | Polling | Webhook |
|--------|---------|---------|
| **Latency** | Higher (60s+ default) | Lower (real-time) |
| **API calls** | Frequent | Only on events |
| **Reliability** | Guaranteed | Depends on retry logic |
| **Setup** | Simple | Complex (registration needed) |
| **Cost** | Higher API usage | Lower API usage |

## Best Practices

### Polling Triggers

1. **Track state properly**: Store last ID or timestamp
2. **Handle duplicates**: Skip already-processed items
3. **Avoid gaps**: Fetch with overlap to catch all items
4. **Batch sending**: Send items in reasonable batches
5. **Handle errors**: Graceful retry on API errors
6. **Respect rate limits**: Use quota management

### Webhook Triggers

1. **Validate signatures**: Verify webhook authenticity
2. **Idempotent handling**: Handle duplicate webhook calls
3. **Persist registration**: Store webhook URL if needed
4. **Handle failures**: Retry registration if it fails
5. **Clean up**: Remove webhook registration on disconnect
6. **Timeout handling**: Handle long webhook waits

## Properties for Advanced Triggers

Some triggers accept configuration properties:

```json
{
    "name": "appmixer.service.core.TaskUpdated",
    "trigger": true,
    "tick": true,
    "properties": {
        "schema": {
            "type": "object",
            "properties": {
                "status": {
                    "type": "string",
                    "title": "Watch for Status",
                    "enum": ["open", "in_progress", "completed"]
                },
                "priority": {
                    "type": "string",
                    "title": "Watch for Priority",
                    "enum": ["low", "medium", "high"]
                }
            }
        },
        "inspector": {
            "inputs": {
                "status": {
                    "type": "select",
                    "index": 1,
                    "options": [
                        { "value": "open", "label": "Open" },
                        { "value": "in_progress", "label": "In Progress" },
                        { "value": "completed", "label": "Completed" }
                    ]
                },
                "priority": {
                    "type": "select",
                    "index": 2,
                    "options": [
                        { "value": "low", "label": "Low" },
                        { "value": "medium", "label": "Medium" },
                        { "value": "high", "label": "High" }
                    ]
                }
            }
        }
    },
    "outPorts": [...]
}
```

With behavior filtering:

```javascript
async tick(context) {
    const { status, priority } = context.properties;
    const lastSeenId = context.state?.lastSeenId || 0;

    const response = await context.httpRequest({
        method: 'GET',
        url: 'https://api.service.com/tasks',
        params: {
            since: lastSeenId,
            status,
            priority,
            limit: 100
        }
    });

    const tasks = response.data.items || [];

    for (const task of tasks) {
        await context.sendJson(task, 'out');
        context.state = { lastSeenId: task.id };
    }
}
```

## Common Trigger Scenarios

### Scenario 1: Process All New Tasks

```javascript
async tick(context) {
    const lastId = context.state?.lastSeenId || 0;

    const { data } = await context.httpRequest({
        method: 'GET',
        url: 'https://api.service.com/tasks',
        params: {
            after: lastId,
            limit: 100
        }
    });

    for (const task of data.items || []) {
        await context.sendJson(task, 'out');
    }

    if (data.items?.length > 0) {
        context.state = { lastSeenId: data.items[data.items.length - 1].id };
    }
}
```

### Scenario 2: Webhook with Validation

```javascript
async webhook(context) {
    const payload = context.messages.webhook;

    // Validate signature
    const signature = context.messages.headers['x-webhook-signature'];
    if (!validateSignature(payload, signature)) {
        throw new Error('Invalid webhook signature');
    }

    return context.sendJson(payload, 'out');
}

function validateSignature(payload, signature) {
    // Implementation specific to service
    return true;
}
```

## Polling Interval

The polling interval (default 60 seconds) can be configured for on-prem installations via `COMPONENT_POLLING_INTERVAL` environment variable.

For most use cases, the default is acceptable. Consider custom intervals for:
- **Very fast-changing data**: Shorter interval (use webhook instead)
- **Infrequent changes**: Longer interval to save API calls

## Related Documentation

- **[Component Types Overview](../overview.md)** - All component patterns
- **[Behavior Reference](../behavior.md)** - Component implementation details
- **[Best Practices](../../05-best-practices/)** - Development guidelines
