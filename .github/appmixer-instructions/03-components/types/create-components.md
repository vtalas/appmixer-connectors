# Part 3: Component Types - Create Components

## Overview

Create components add new items to the external service and return the created item data.

## Pattern

`Create{EntityName}` - e.g., `CreateTask`, `CreateUser`, `CreateProject`

## Key Characteristics

- Creates new item in service
- Returns created item with ID
- Requires specific fields (at minimum a name/title)
- Fields vary by entity type
- Returns complete item object

## component.json Structure

```json
{
    "name": "appmixer.service.core.CreateTask",
    "label": "Create Task",
    "description": "Create a new task in the service.",
    "author": "Appmixer <info@appmixer.com>",
    "version": "1.0.0",
    "auth": {
        "service": "appmixer:service"
    },
    "quota": {
        "manager": "appmixer:service",
        "resources": "tasks.create",
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
                    "dueDate": {
                        "type": "string",
                        "format": "date",
                        "title": "Due Date"
                    },
                    "assignee": {
                        "type": "string",
                        "title": "Assignee"
                    }
                },
                "required": ["title"]
            },
            "inspector": {
                "inputs": {
                    "title": {
                        "type": "text",
                        "index": 1,
                        "label": "Title",
                        "tooltip": "Task title (required)"
                    },
                    "description": {
                        "type": "textarea",
                        "index": 2,
                        "label": "Description",
                        "tooltip": "Task description (optional)"
                    },
                    "priority": {
                        "type": "select",
                        "index": 3,
                        "label": "Priority",
                        "options": [
                            { "label": "Low", "value": "low" },
                            { "label": "Medium", "value": "medium" },
                            { "label": "High", "value": "high" }
                        ]
                    },
                    "dueDate": {
                        "type": "date",
                        "index": 4,
                        "label": "Due Date",
                        "tooltip": "When the task should be completed"
                    },
                    "assignee": {
                        "type": "text",
                        "index": 5,
                        "label": "Assignee",
                        "tooltip": "Email or user ID of assignee"
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
                { "label": "Priority", "value": "priority" },
                { "label": "Status", "value": "status" },
                { "label": "Created Date", "value": "created_at" },
                { "label": "Due Date", "value": "dueDate" },
                { "label": "Assignee", "value": "assignee" }
            ]
        }
    ]
}
```

### Key Points

- **Required fields**: Mark in schema `required` array
- **Enum fields**: Use `enum` for restricted options
- **Describe all inputs**: Include all fields the service accepts
- **Output includes ID**: Always include the generated ID in output
- **Optional fields**: Mark non-required fields clearly in description

## Behavior Pattern

```javascript
module.exports = {
    async receive(context) {
        // 1. Get input data
        const { title, description, priority, dueDate, assignee } 
            = context.messages.in.content;

        // 2. Validate required inputs
        if (!title) {
            throw new context.CancelError('Title is required!');
        }

        // 3. Prepare request data
        const payload = {
            title,
            description: description || '',
            priority: priority || 'medium',
            dueDate
        };

        if (assignee) {
            payload.assignee = assignee;
        }

        // 4. Make API request
        const response = await context.httpRequest({
            method: 'POST',
            url: 'https://api.service.com/tasks',
            headers: {
                'Authorization': `Bearer ${context.auth.accessToken}`,
                'Content-Type': 'application/json'
            },
            data: payload
        });

        // 5. Send created item
        return context.sendJson(response.data, 'out');
    }
};
```

## Advanced: Field Mapping

```javascript
module.exports = {
    async receive(context) {
        const { title, description, priority, dueDate, assignee } 
            = context.messages.in.content;

        if (!title) {
            throw new context.CancelError('Title is required!');
        }

        // Map to API field names if different
        const payload = {
            name: title,  // API uses 'name', not 'title'
            description,
            severity: priority,  // Map 'priority' to 'severity'
            due: dueDate,  // Map 'dueDate' to 'due'
            assignee_email: assignee
        };

        const response = await context.httpRequest({
            method: 'POST',
            url: 'https://api.service.com/tasks',
            headers: {
                'Authorization': `Bearer ${context.auth.accessToken}`,
                'Content-Type': 'application/json'
            },
            data: payload
        });

        // Transform response back to standard field names
        const created = {
            id: response.data.id,
            title: response.data.name,
            description: response.data.description,
            priority: response.data.severity,
            dueDate: response.data.due,
            assignee: response.data.assignee_email,
            status: response.data.state,
            created_at: response.data.created_at
        };

        return context.sendJson(created, 'out');
    }
};
```

## Usage Examples

### Create Task from Form

```
[Form Input]
  ↓ (user fills title, priority, due date)
[Create Task]
  ↓ (returns created task ID)
[Send Confirmation Email]
```

### Create with Lookup

```
[Find User]
  ↓ (gets user ID)
[Create Task]
  (maps user ID to assignee field)
  ↓ (task created and assigned)
[Update Spreadsheet]
```

## Field Type Guidelines

| Type | Inspector Type | Notes |
|------|---|---|
| String | `text` | For short strings |
| Long text | `textarea` | For descriptions, notes |
| Number | `number` | For quantities, counts |
| Date | `date` | For date-only fields |
| DateTime | `date` with time | For timestamp fields |
| Boolean | `toggle` | For yes/no fields |
| Enum | `select` | For predefined options |
| Reference | `text` or `select` | For IDs or lookups |

## Error Handling

```javascript
async receive(context) {
    const { title, description, priority } 
        = context.messages.in.content;

    if (!title) {
        throw new context.CancelError('Title is required!');
    }

    try {
        const response = await context.httpRequest({
            method: 'POST',
            url: 'https://api.service.com/tasks',
            headers: {
                'Authorization': `Bearer ${context.auth.accessToken}`,
                'Content-Type': 'application/json'
            },
            data: { title, description, priority }
        });

        return context.sendJson(response.data, 'out');
    } catch (error) {
        if (error.status === 400) {
            throw new context.CancelError(
                `Invalid data: ${error.message}`
            );
        }
        if (error.status === 403) {
            throw new context.CancelError(
                'Permission denied: you cannot create tasks'
            );
        }
        throw error;
    }
}
```

## Best Practices

1. **Validate required fields**: Always validate before API call
2. **Use meaningful labels**: Help users understand what each field does
3. **Set sensible defaults**: For optional fields, provide defaults if service requires them
4. **Document optional vs required**: Mark clearly in tooltips and descriptions
5. **Return complete object**: Include all fields from created item, especially ID
6. **Handle errors gracefully**: Provide clear error messages
7. **Map field names**: If API uses different names, map internally
8. **Test with defaults**: Ensure creation works with minimal inputs

## Related Documentation

- **[Get Components](get-components.md)** - Retrieve created items
- **[Update Components](update-components.md)** - Modify existing items
- **[Delete Components](delete-components.md)** - Remove items
- **[Behavior Reference](behavior.md)** - Component behavior implementation
