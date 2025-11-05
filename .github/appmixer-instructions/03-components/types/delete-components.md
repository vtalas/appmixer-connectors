# Part 3: Component Types - Delete Components

## Overview

Delete components remove items by their unique identifier. They're irreversible operations that remove data from the service.

## Pattern

`Delete{EntityName}` - e.g., `DeleteTask`, `DeleteUser`, `DeleteProject`

## Key Characteristics

- **Irreversible**: Item is permanently removed
- **ID required**: Must have unique identifier
- **Empty response**: Returns empty object `{}` on success
- **No data fields**: Only requires ID, nothing else
- **Single output port**: Standard `out` port
- **Error if not found**: Throws error if ID doesn't exist

## component.json Structure

```json
{
    "name": "appmixer.service.core.DeleteTask",
    "label": "Delete Task",
    "description": "Delete a specific task by ID. This action cannot be undone.",
    "author": "Appmixer <info@appmixer.com>",
    "version": "1.0.0",
    "auth": {
        "service": "appmixer:service"
    },
    "quota": {
        "manager": "appmixer:service",
        "resources": "tasks.delete",
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
                        "tooltip": "The unique identifier of the task to delete"
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

- **taskId required**: Mark in schema `required` array
- **outPorts minimal**: Only `["out"]` with no options
- **Empty response**: Component returns empty object, not the deleted item
- **Warning in description**: Mention that deletion is permanent

## Behavior Pattern

```javascript
module.exports = {
    async receive(context) {
        // 1. Get and validate input
        const { taskId } = context.messages.in.content;
        
        if (!taskId) {
            throw new context.CancelError('Task ID is required!');
        }

        // 2. Make API request to delete
        await context.httpRequest({
            method: 'DELETE',
            url: `https://api.service.com/tasks/${taskId}`,
            headers: {
                'Authorization': `Bearer ${context.auth.accessToken}`
            }
        });

        // 3. Return empty object (always)
        return context.sendJson({}, 'out');
    }
};
```

## Advanced: Soft Delete

Some services support "soft delete" (marking as deleted instead of removal):

```javascript
module.exports = {
    async receive(context) {
        const { taskId } = context.messages.in.content;
        
        if (!taskId) {
            throw new context.CancelError('Task ID is required!');
        }

        // Some APIs require PATCH instead of DELETE
        const response = await context.httpRequest({
            method: 'PATCH',
            url: `https://api.service.com/tasks/${taskId}`,
            headers: {
                'Authorization': `Bearer ${context.auth.accessToken}`,
                'Content-Type': 'application/json'
            },
            data: {
                status: 'deleted',  // Mark as deleted
                deletedAt: new Date().toISOString()
            }
        });

        // Still return empty object for consistency
        return context.sendJson({}, 'out');
    }
};
```

## Usage Examples

### Delete Single Item

```
[Find Task]
  ↓ (identifies task ID)
[Delete Task]
  ↓ (task removed)
[Log Completion]
```

### Delete with Confirmation

```
[User Triggers Delete]
  ↓
[Confirm with User]
  ↓ (if yes)
[Delete Task]
  ↓
[Send Confirmation Email]
```

## Error Handling

```javascript
async receive(context) {
    const { taskId } = context.messages.in.content;

    if (!taskId) {
        throw new context.CancelError('Task ID is required!');
    }

    try {
        await context.httpRequest({
            method: 'DELETE',
            url: `https://api.service.com/tasks/${taskId}`,
            headers: {
                'Authorization': `Bearer ${context.auth.accessToken}`
            }
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
                'You do not have permission to delete this task'
            );
        }
        throw error;
    }
}
```

## Return Value Rule

⚠️ **IMPORTANT**: Delete components **MUST** return empty object:

```javascript
// ✅ CORRECT
return context.sendJson({}, 'out');

// ❌ WRONG - don't return the deleted item data
return context.sendJson(response.data, 'out');

// ❌ WRONG - don't return the ID
return context.sendJson({ id: taskId }, 'out');
```

## Best Practices

1. **Validate ID**: Always check that ID is provided
2. **Return empty object**: Consistency across all delete components
3. **Clear error messages**: Explain why deletion failed
4. **Document permanence**: Warn users in description
5. **Distinguish error types**: 404 vs 403 vs other errors
6. **No cascading deletes**: Let service handle related items
7. **Consider audit logging**: Document what was deleted

## Common Patterns

### Multiple Delete

To delete multiple items, create separate workflow branches:

```
[Find Tasks]
  ↓ (returns multiple task IDs)
[Loop over tasks]
  ↓ (for each)
[Delete Task]
```

### Delete with Backup

Some workflows backup before deletion:

```
[Get Task]
  ↓
[Save to Archive]
  ↓
[Delete Task]
```

## Why Empty Object?

The empty return value serves several purposes:

1. **Safety**: Reduces accidental data exposure
2. **Consistency**: All delete components behave the same
3. **Clarity**: Confirms operation succeeded, not showing what was lost
4. **Audit**: System knows operation completed without need for response data

## Related Documentation

- **[Get Components](get-components.md)** - Retrieve items before deletion
- **[Update Components](update-components.md)** - Alternative to deletion (soft delete)
- **[Create Components](create-components.md)** - Creating items
- **[Behavior Reference](behavior.md)** - Component behavior implementation
