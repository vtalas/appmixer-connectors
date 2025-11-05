# Part 3: Component Types - Get Components

## Overview

Get components retrieve a single item by its unique identifier. They require the item ID and return the full item details.

## Pattern

`Get{EntityName}` - e.g., `GetTask`, `GetUser`, `GetProject`

## Key Characteristics

- Retrieves single item
- Requires unique identifier (ID)
- Returns complete item data
- Throws error if item not found
- No output port for "not found" (error is sufficient)

## component.json Structure

```json
{
    "name": "appmixer.service.core.GetTask",
    "label": "Get Task",
    "description": "Retrieve a specific task by ID.",
    "author": "Appmixer <info@appmixer.com>",
    "version": "1.0.0",
    "auth": {
        "service": "appmixer:service"
    },
    "quota": {
        "manager": "appmixer:service",
        "resources": "tasks.get",
        "scope": {
            "userId": "{{userId}}"
        }
    },
    "inPorts": [
        {
            "name": "in",
            "schema": {
                "type": "object",
                "properties": {
                    "taskId": {
                        "type": "string",
                        "title": "Task ID"
                    }
                },
                "required": ["taskId"]
            },
            "inspector": {
                "inputs": {
                    "taskId": {
                        "type": "text",
                        "index": 1,
                        "label": "Task ID",
                        "tooltip": "The unique identifier of the task"
                    }
                }
            }
        }
    ],
    "outPorts": [
        {
            "name": "out",
            "options": [
                { "label": "Task ID", "value": "id" },
                { "label": "Title", "value": "title" },
                { "label": "Description", "value": "description" },
                { "label": "Status", "value": "status" },
                { "label": "Created Date", "value": "created_at" },
                { "label": "Updated Date", "value": "updated_at" }
            ]
        }
    ]
}
```

### Key Points

- **taskId required**: Mark in schema `required` array
- **One output port**: Standard `out` port
- **Options defined**: Include all relevant fields from the item
- **No notFound port**: Not needed for Get components

## Behavior Pattern

```javascript
module.exports = {
    async receive(context) {
        // 1. Get and validate input
        const { taskId } = context.messages.in.content;
        
        if (!taskId) {
            throw new context.CancelError('Task ID is required!');
        }

        // 2. Make API request
        const response = await context.httpRequest({
            method: 'GET',
            url: `https://api.service.com/tasks/${taskId}`,
            headers: {
                'Authorization': `Bearer ${context.auth.accessToken}`
            }
        });

        // 3. Validate response
        if (!response.data || !response.data.id) {
            throw new Error(`Task ${taskId} not found`);
        }

        // 4. Send output
        return context.sendJson(response.data, 'out');
    }
};
```

## Advanced: Transform Response

```javascript
module.exports = {
    async receive(context) {
        const { taskId } = context.messages.in.content;
        
        if (!taskId) {
            throw new context.CancelError('Task ID is required!');
        }

        const response = await context.httpRequest({
            method: 'GET',
            url: `https://api.service.com/tasks/${taskId}`,
            headers: {
                'Authorization': `Bearer ${context.auth.accessToken}`
            }
        });

        // Transform if needed
        const task = {
            id: response.data.id,
            title: response.data.name,
            description: response.data.desc,
            status: response.data.state,
            created_at: response.data.created,
            updated_at: response.data.modified,
            assignee: response.data.owner?.email
        };

        return context.sendJson(task, 'out');
    }
};
```

## Usage Examples

### Basic ID Lookup

User provides task ID from upstream component:

```
[Find Tasks] → [Get Task] → [Process Result]
  returns              requires
  taskId               taskId
```

### In a Workflow

```
[Find Tasks]
  ↓ (outputs taskId)
[Get Task Details]
  ↓ (full task object)
[Send Notification]
```

## Error Handling

```javascript
async receive(context) {
    const { taskId } = context.messages.in.content;
    
    if (!taskId) {
        throw new context.CancelError('Task ID is required!');
    }

    try {
        const response = await context.httpRequest({
            method: 'GET',
            url: `https://api.service.com/tasks/${taskId}`
        });

        if (!response.data) {
            throw new Error(`Task ${taskId} not found`);
        }

        return context.sendJson(response.data, 'out');
    } catch (error) {
        if (error.status === 404) {
            throw new context.CancelError(
                `Task ${taskId} does not exist`
            );
        }
        throw error;
    }
}
```

## Best Practices

1. **Validate ID**: Always check that ID is provided and non-empty
2. **Handle not found**: Throw meaningful error if item doesn't exist
3. **Include all fields**: List all available fields in `outPorts.options`
4. **Transform if needed**: Map API response to user-friendly field names
5. **Handle errors**: Distinguish between validation errors and API errors
6. **Document ID source**: Add tooltip about where ID comes from
7. **Consider caching**: If frequently accessed, consider caching results

## Related Documentation

- **[Find Components](find-components.md)** - Find items by search criteria
- **[List Components](list-components.md)** - List all items
- **[Create Components](create-components.md)** - Create new items
- **[Behavior Reference](behavior.md)** - Component behavior implementation
