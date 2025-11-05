# Part 3: Component Types - List Components

## Overview

List components retrieve all items of a specific type. Unlike Find components, they don't filter by search criteria—they retrieve the complete set of items. Use List when the service doesn't provide filtering options.

## Pattern

`List{EntityName}` - e.g., `ListForms`, `ListUsers`, `ListProjects`

## Key Characteristics

- Returns all items of a type (no search/filter)
- Includes `outputType` for flexible output format
- **No pagination**: Uses maximum page size from API
- **No limit parameter**: Returns all available items
- Returns data in a single page fetch
- Document maximum items per page in description

## When to Use

- Service API doesn't support search/filtering
- Need to list all items in a collection
- Simple retrieval without complex criteria
- Alternative to Find when filtering unavailable

**Note**: Prefer Find components when possible, as they offer more flexibility and often better performance.

## component.json Structure

```json
{
    "name": "appmixer.googleForms.core.ListForms",
    "label": "List Forms",
    "description": "Fetches a list of all Google Forms. This component returns a maximum of 1000 records per request.",
    "author": "Appmixer <info@appmixer.com>",
    "version": "1.0.0",
    "auth": {
        "service": "appmixer:googleForms",
        "scope": [
            "https://www.googleapis.com/auth/drive.readonly"
        ]
    },
    "quota": {
        "manager": "appmixer:googleForms",
        "resources": "forms.list",
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
                    "outputType": {
                        "type": "string",
                        "title": "Output Type",
                        "default": "array"
                    }
                }
            },
            "inspector": {
                "inputs": {
                    "outputType": {
                        "type": "select",
                        "index": 1,
                        "label": "Output Type",
                        "defaultValue": "array",
                        "tooltip": "Choose output format: first item only, all items at once, one item at a time, or CSV file",
                        "options": [
                            { "label": "First Item Only", "value": "first" },
                            { "label": "All items at once", "value": "array" },
                            { "label": "One item at a time", "value": "object" },
                            { "label": "Store to CSV file", "value": "file" }
                        ]
                    }
                }
            }
        }
    ],
    "outPorts": [
        {
            "name": "out",
            "source": {
                "url": "/component/appmixer/googleForms/core/ListForms?outPort=out",
                "data": {
                    "properties": {
                        "generateOutputPortOptions": true
                    },
                    "messages": {
                        "in/outputType": "inputs/in/outputType"
                    }
                }
            }
        }
    ]
}
```

### Key Differences from Find

| Aspect | Find | List |
|--------|------|------|
| **Search/Filter** | Yes | No |
| **Input Fields** | query, status, filter, etc. | None or minimal |
| **outputType** | Yes | Yes |
| **Limit Parameter** | Yes (capped) | No |
| **notFound Port** | Optional | Not needed |
| **Use Case** | Filtered search | All items |

## Behavior Pattern

```javascript
'use strict';

const lib = require('../../lib');

// Define schema for single item
const schema = {
    'id': { 'type': 'string', 'title': 'Form ID' },
    'title': { 'type': 'string', 'title': 'Form Title' },
    'createdTime': { 'type': 'string', 'title': 'Created Time' },
    'modifiedTime': { 'type': 'string', 'title': 'Modified Time' },
    'webViewLink': { 'type': 'string', 'title': 'Web View Link' }
};

module.exports = {

    async receive(context) {
        const { outputType } = context.messages.in.content;

        // Generate output schema dynamically
        if (context.properties.generateOutputPortOptions) {
            return lib.getOutputPortOptions(
                context,
                outputType,
                schema,
                { label: 'Forms', value: 'forms' }
            );
        }

        // Build API request with maximum page size
        const params = {
            q: 'mimeType=\'application/vnd.google-apps.form\'',
            pageSize: 1000,  // Use service maximum
            fields: 'files(id,name,createdTime,modifiedTime,webViewLink,owners)',
            supportsAllDrives: true,
            includeItemsFromAllDrives: true,
            orderBy: 'modifiedTime desc'
        };

        // Fetch all items
        const { data } = await context.httpRequest({
            method: 'GET',
            url: 'https://www.googleapis.com/drive/v3/files',
            headers: {
                'Authorization': `Bearer ${context.auth.accessToken}`
            },
            params
        });

        const forms = data.files || [];

        // Send output in requested format
        return lib.sendArrayOutput({
            context,
            outputPortName: 'out',
            outputType,
            records: forms
        });
    }
};
```

## Handling Large Datasets

When working with large result sets:

### Option 1: Stream to CSV File

```javascript
// In component.json, support 'file' outputType
if (outputType === 'file') {
    return lib.sendArrayOutput({
        context,
        outputType: 'file',
        records: allItems
    });
}
```

### Option 2: Paginated Approach

If service supports pagination and you need all items:

```javascript
const allItems = [];
let pageToken = null;

do {
    const params = {
        pageSize: 1000,
        pageToken
    };

    const { data } = await context.httpRequest({
        method: 'GET',
        url: 'https://api.service.com/items',
        params
    });

    allItems.push(...(data.items || []));
    pageToken = data.nextPageToken;
} while (pageToken);

return lib.sendArrayOutput({
    context,
    outputType,
    records: allItems
});
```

### Option 3: Single-Item Output for UI Interaction

For long lists, send one at a time:

```javascript
if (outputType === 'object') {
    for (let index = 0; index < forms.length; index++) {
        await context.sendJson(
            { ...forms[index], index, count: forms.length },
            'out'
        );
    }
}
```

## Best Practices

1. **Document maximum items**: Clearly state in description what's returned
2. **Use maximum page size**: Don't use defaults, specify maximum
3. **Order results**: Add `orderBy` for consistent ordering (usually by modification time)
4. **Support all output types**: Implement all four output formats
5. **Handle empty sets**: Gracefully handle when no items exist
6. **Add metadata**: Include `index` and `count` for pagination info
7. **Cache considerations**: These calls often benefit from caching between executions

## Example: Listing Users

```javascript
module.exports = {
    async receive(context) {
        const { outputType } = context.messages.in.content;

        if (context.properties.generateOutputPortOptions) {
            const schema = {
                'id': { 'type': 'string' },
                'email': { 'type': 'string' },
                'name': { 'type': 'string' },
                'role': { 'type': 'string' }
            };
            return lib.getOutputPortOptions(
                context,
                outputType,
                schema,
                { label: 'Users', value: 'users' }
            );
        }

        // Fetch all users
        const { data } = await context.httpRequest({
            method: 'GET',
            url: 'https://api.service.com/users',
            params: { limit: 1000 },
            headers: {
                'Authorization': `Bearer ${context.auth.accessToken}`
            }
        });

        const users = data.users || [];

        return lib.sendArrayOutput({
            context,
            outputType,
            records: users
        });
    }
};
```

## Comparing Find vs List

**Use Find when**:
- User needs to search/filter results
- Service supports powerful search/query operators
- Results can be large and filtering reduces load
- Complex filtering logic available

**Use List when**:
- Service doesn't support search/filtering
- All results are always needed
- Result set is manageable in size
- Simple retrieval without criteria

**Example**:
- Slack: Use Find for searching messages, List for listing channels
- Google Docs: Use Find for searching by name, List for all forms
- Asana: Use Find for filtered tasks, List for all projects

## Related Documentation

- **[Find Components](find-components.md)** - Search with filtering
- **[Get Components](get-components.md)** - Get single item by ID
- **[Behavior Reference](behavior.md)** - Component behavior implementation
