# Part 3: Component Types - Update Components

## Overview

Update components modify existing items by their unique identifier. They return an empty object on success per Appmixer standards.

## Pattern

`Update{EntityName}` - e.g., `UpdateTask`, `UpdateUser`, `UpdateProject`

## Key Characteristics

- **ID required**: Always needs item identifier
- **Partial updates**: Can update individual fields
- **Empty response**: Returns empty object `{}` on success
- **At least one other field**: Besides ID for update
- **Single output port**: Standard `out` port
- **Error if not found**: Throws error if ID doesn't exist

## component.json Structure

```json
{
    "name": "appmixer.service.core.UpdateTask",
    "label": "Update Task",
    "description": "Update an existing task. Provide the Task ID and the fields you want to update.",
    "author": "Appmixer <info@appmixer.com>",
    "version": "1.0.0",
    "auth": {
        "service": "appmixer:service"
    },
    "quota": {
        "manager": "appmixer:service",
        "resources": "tasks.update",
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
                    },
                    "title": {
                        "type": "string",
                        "title": "Title"
                    },
                    "description": {
                        "type": "string",
                        "title": "Description"
                    },
                    "priority": {
                        "type": "string",
                        "title": "Priority",
                        "enum": ["low", "medium", "high"]
                    },
                    "status": {
                        "type": "string",
                        "title": "Status",
                        "enum": ["open", "in_progress", "completed"]
                    },
                    "dueDate": {
                        "type": "string",
                        "format": "date",
                        "title": "Due Date"
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
                        "tooltip": "The unique identifier of the task (required)"
                    },
                    "title": {
                        "type": "text",
                        "index": 2,
                        "label": "Title",
                        "tooltip": "Task title (optional)"
                    },
                    "description": {
                        "type": "textarea",
                        "index": 3,
                        "label": "Description",
                        "tooltip": "Task description (optional)"
                    },
                    "priority": {
                        "type": "select",
                        "index": 4,
                        "label": "Priority",
                        "options": [
                            { "label": "Low", "value": "low" },
                            { "label": "Medium", "value": "medium" },
                            { "label": "High", "value": "high" }
                        ]
                    },
                    "status": {
                        "type": "select",
                        "index": 5,
                        "label": "Status",
                        "options": [
                            { "label": "Open", "value": "open" },
                            { "label": "In Progress", "value": "in_progress" },
                            { "label": "Completed", "value": "completed" }
                        ]
                    },
                    "dueDate": {
                        "type": "date",
                        "index": 6,
                        "label": "Due Date",
                        "tooltip": "When the task should be completed (optional)"
                    }
                }
            }
        }
    ],
    "outPorts": [
        {
            "name": "out"
        }
    ]
}
```

### Key Points

- **taskId required**: Always mark ID in schema `required` array
- **Other fields optional**: Only include fields that need updating
- **outPorts minimal**: Only `["out"]` with no options
- **Empty response**: Component returns empty object, not updated item

## Behavior Pattern

```javascript
module.exports = {
    async receive(context) {
        // 1. Get input data
        const { taskId, title, description, priority, status, dueDate } 
            = context.messages.in.content;

        // 2. Validate required input
        if (!taskId) {
            throw new context.CancelError('Task ID is required!');
        }

        // 3. Build update payload with only provided fields
        const updates = {};
        
        if (title !== undefined && title !== null && title !== '') {
            updates.title = title;
        }
        if (description !== undefined && description !== null && description !== '') {
            updates.description = description;
        }
        if (priority) {
            updates.priority = priority;
        }
        if (status) {
            updates.status = status;
        }
        if (dueDate) {
            updates.dueDate = dueDate;
        }

        // 4. Make API request
        await context.httpRequest({
            method: 'PATCH',
            url: `https://api.service.com/tasks/${taskId}`,
            headers: {
                'Authorization': `Bearer ${context.auth.accessToken}`,
                'Content-Type': 'application/json'
            },
            data: updates
        });

        // 5. Return empty object
        return context.sendJson({}, 'out');
    }
};
```

## Advanced: Field Mapping

```javascript
module.exports = {
    async receive(context) {
        const { taskId, title, description, priority, status } 
            = context.messages.in.content;

        if (!taskId) {
            throw new context.CancelError('Task ID is required!');
        }

        // Map to API field names
        const updates = {};
        
        if (title) updates.name = title;  // API uses 'name'
        if (description) updates.desc = description;
        if (priority) updates.severity = priority;
        if (status) updates.state = status;

        const response = await context.httpRequest({
            method: 'PATCH',
            url: `https://api.service.com/tasks/${taskId}`,
            headers: {
                'Authorization': `Bearer ${context.auth.accessToken}`,
                'Content-Type': 'application/json'
            },
            data: updates
        });

        return context.sendJson({}, 'out');
    }
};
```

## Usage Examples

### Update from Form

```
[Form Input]
  ↓ (user fills taskId and new values)
[Update Task]
  ↓ (updates specified fields)
[Log Update]
```

### Conditional Update

```
[Find Task]
  ↓
[Decision: If priority high?]
  ├─ Yes → [Update Status to In Progress]
  └─ No → [Update Status to Open]
```

### Bulk Update

Multiple tasks can be updated separately:

```
[Find Tasks]
  ↓ (multiple tasks)
[For each task]
  ↓
[Update Task]
```

## Field Handling

### Only Update Provided Fields

```javascript
// Only include fields that have values
const updates = {};

if (title !== undefined && title !== '') {
    updates.title = title;
}
if (priority) {
    updates.priority = priority;
}

// This prevents clearing fields by passing null/empty
```

### Clear Empty Fields

If the API supports it and user wants to clear a field:

```javascript
const updates = {};

if (title !== undefined) {
    updates.title = title || null;  // Allow clearing
}
```

## Error Handling

```javascript
async receive(context) {
    const { taskId, title, priority } = context.messages.in.content;

    if (!taskId) {
        throw new context.CancelError('Task ID is required!');
    }

    const updates = {};
    if (title) updates.title = title;
    if (priority) updates.priority = priority;

    try {
        await context.httpRequest({
            method: 'PATCH',
            url: `https://api.service.com/tasks/${taskId}`,
            headers: {
                'Authorization': `Bearer ${context.auth.accessToken}`,
                'Content-Type': 'application/json'
            },
            data: updates
        });

        return context.sendJson({}, 'out');
    } catch (error) {
        if (error.status === 404) {
            throw new context.CancelError(
                `Task ${taskId} not found`
            );
        }
        if (error.status === 403) {
            throw new context.CancelError(
                'You do not have permission to update this task'
            );
        }
        if (error.status === 400) {
            throw new context.CancelError(
                `Invalid data: ${error.message}`
            );
        }
        throw error;
    }
}
```

## Return Value Rule

⚠️ **IMPORTANT**: Update components **MUST** return empty object:

```javascript
// ✅ CORRECT
return context.sendJson({}, 'out');

// ❌ WRONG - don't return the updated item
return context.sendJson(response.data, 'out');

// ❌ WRONG - don't return confirmation details
return context.sendJson({ updated: true }, 'out');
```

## Differences from Create

| Aspect | Create | Update |
|--------|--------|--------|
| **Required Input** | Specific fields | ID + optional fields |
| **Partial updates** | N/A | Yes, all fields optional |
| **Return value** | Created item object | Empty object |
| **Purpose** | New item | Modify existing |

## Best Practices

1. **Validate ID**: Always check Task ID is provided
2. **Optional fields**: Make all update fields optional except ID
3. **Skip empty values**: Don't send empty strings as updates
4. **Return empty object**: Consistency with delete components
5. **Field mapping**: Map to API field names if different
6. **Clear error messages**: Explain what went wrong
7. **Check permissions**: Distinguish permission errors
8. **Document optional nature**: Help users understand which fields can be omitted

## Related Documentation

- **[Get Components](get-components.md)** - Retrieve items before updating
- **[Create Components](create-components.md)** - Creating new items
- **[Delete Components](delete-components.md)** - Removing items
- **[Behavior Reference](behavior.md)** - Component behavior implementation
