# Part 3: Component Types - Find Components

## Overview

Find components search for items based on criteria and return matching results as an array.

## Pattern

`Find{EntityName}` - e.g., `FindTasks`, `FindUsers`, `FindProjects`

## Key Characteristics

- Returns array of items
- Includes `outputType` for flexible output format
- Has optional `notFound` output port for no matches
- Maximum items limited by API pagination
- Query/filter parameters control search scope
- Returns maximum items per single page (no pagination)

## component.json Structure

```json
{
    "name": "appmixer.service.core.FindTasks",
    "label": "Find Tasks",
    "description": "Search for tasks based on specified criteria. This component will return a maximum of 500 records.",
    "author": "Appmixer <info@appmixer.com>",
    "version": "1.0.0",
    "auth": {
        "service": "appmixer:service"
    },
    "quota": {
        "manager": "appmixer:service",
        "resources": "tasks.find",
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
                    "query": {
                        "type": "string",
                        "title": "Search Query"
                    },
                    "status": {
                        "type": "string",
                        "title": "Status"
                    },
                    "limit": {
                        "type": "number",
                        "title": "Limit",
                        "default": 50
                    },
                    "outputType": {
                        "type": "string",
                        "title": "Output Type",
                        "default": "array"
                    }
                }
            },
            "inspector": {
                "inputs": {
                    "query": {
                        "type": "text",
                        "index": 1,
                        "label": "Search Query",
                        "tooltip": "Search term to find tasks"
                    },
                    "status": {
                        "type": "select",
                        "index": 2,
                        "label": "Status",
                        "options": [
                            { "label": "All", "value": "" },
                            { "label": "Open", "value": "open" },
                            { "label": "Completed", "value": "completed" }
                        ]
                    },
                    "limit": {
                        "type": "number",
                        "index": 3,
                        "label": "Limit",
                        "tooltip": "Maximum number of results (max: 500)"
                    },
                    "outputType": {
                        "type": "select",
                        "index": 5,
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
                "url": "/component/appmixer/service/core/FindTasks?outPort=out",
                "data": {
                    "properties": {
                        "generateOutputPortOptions": true
                    },
                    "messages": {
                        "in/outputType": "inputs/in/outputType"
                    }
                }
            }
        },
        {
            "name": "notFound"
        }
    ]
}
```

### Key Points

- **outputType last**: Add `outputType` as final required property with highest index
- **Dynamic schema**: Use `source` in `outPorts` to generate options based on `outputType`
- **notFound port**: Optional port for when no matches found
- **limit**: Set reasonable default (50-100) and document maximum

## Behavior Pattern

```javascript
'use strict';

const lib = require('../../lib');

// Define schema for single item
const schema = {
    'id': { 'type': 'string', 'title': 'Task ID' },
    'name': { 'type': 'string', 'title': 'Task Name' },
    'status': { 'type': 'string', 'title': 'Status' },
    'created_at': { 'type': 'string', 'title': 'Created At' }
};

module.exports = {

    async receive(context) {
        const {
            query,
            status,
            limit = 50,
            outputType
        } = context.messages.in.content;

        // Generate output schema dynamically (required by component.json source definition)
        if (context.properties.generateOutputPortOptions) {
            return lib.getOutputPortOptions(
                context,
                outputType,
                schema,
                { label: 'Tasks', value: 'tasks' }
            );
        }

        // Build search query
        let searchQuery = '';
        if (query) {
            searchQuery = `name contains '${query.replace(/'/g, '\\\'')}'`;
        }
        if (status) {
            searchQuery += searchQuery ? ` AND status = '${status}'` : `status = '${status}'`;
        }

        // Make API request
        const params = {
            q: searchQuery,
            limit: Math.min(limit, 500),  // Cap at service maximum
            orderBy: 'created_at desc'
        };

        const { data } = await context.httpRequest({
            method: 'GET',
            url: 'https://api.service.com/tasks',
            headers: {
                'Authorization': `Bearer ${context.auth.accessToken}`
            },
            params
        });

        const tasks = data.items || [];

        // Handle no results
        if (tasks.length === 0) {
            return context.sendJson({}, 'notFound');
        }

        // Format output based on outputType
        return lib.sendArrayOutput({
            context,
            outputPortName: 'out',
            outputType,
            records: tasks
        });
    }
};
```

## lib.js Helper

```javascript
module.exports = {

    async sendArrayOutput({
        context,
        outputPortName = 'out',
        outputType = 'array',
        records = []
    }) {
        if (outputType === 'first') {
            // Send first item only
            if (records.length === 0) {
                throw new context.CancelError('No records found');
            }
            await context.sendJson(
                { ...records[0], index: 0, count: records.length },
                outputPortName
            );
        } else if (outputType === 'object') {
            // Send one item at a time
            for (let index = 0; index < records.length; index++) {
                await context.sendJson(
                    { ...records[index], index, count: records.length },
                    outputPortName
                );
            }
        } else if (outputType === 'array') {
            // Send all at once
            await context.sendJson(
                { result: records, count: records.length },
                outputPortName
            );
        } else if (outputType === 'file') {
            // Save to CSV file
            const csvString = toCsv(records);
            const buffer = Buffer.from(csvString, 'utf8');
            const fileName = `tasks-export.csv`;
            const savedFile = await context.saveFileStream(fileName, buffer);
            await context.sendJson({ fileId: savedFile.fileId }, outputPortName);
        }
    },

    getOutputPortOptions(context, outputType, itemSchema, { label, value }) {
        if (outputType === 'object' || outputType === 'first') {
            // Single item output
            const options = Object.keys(itemSchema)
                .reduce((res, field) => {
                    const schema = itemSchema[field];
                    const { title: fieldLabel, ...schemaWithoutTitle } = schema;
                    res.push({
                        label: fieldLabel,
                        value: field,
                        schema: schemaWithoutTitle
                    });
                    return res;
                }, [
                    { label: 'Current Item Index', value: 'index', schema: { type: 'integer' } },
                    { label: 'Items Count', value: 'count', schema: { type: 'integer' } }
                ]);
            return context.sendJson(options, 'out');
        }

        if (outputType === 'array') {
            // Array output
            return context.sendJson([{
                label,
                value,
                schema: {
                    type: 'array',
                    items: { type: 'object', properties: itemSchema }
                }
            }], 'out');
        }

        if (outputType === 'file') {
            // File output
            return context.sendJson([{ label: 'File ID', value: 'fileId' }], 'out');
        }
    }
};

const toCsv = (array) => {
    const headers = Object.keys(array[0]);
    return [
        headers.join(','),
        ...array.map(item =>
            Object.values(item)
                .map(val => typeof val === 'object' ? JSON.stringify(val) : val)
                .join(',')
        )
    ].join('\n');
};
```

## Output Types

| Type | When to Use | Output |
|------|------------|--------|
| **first** | Need just one result | Single item with `index: 0, count: total` |
| **array** | All results at once | `{ result: [...], count: N }` |
| **object** | One item per message | Multiple messages, each with `index` and `count` |
| **file** | Large result sets | CSV file ID for download |

## Best Practices

1. **Validate inputs**: Check required fields before API call
2. **Limit results**: Document and enforce service maximum
3. **Build filters carefully**: Escape special characters in queries
4. **Handle no results**: Use `notFound` port or throw error
5. **Set reasonable defaults**: Limit, sort order, filters
6. **Include metadata**: Add `index` and `count` for `first` and `object` outputs
7. **Support all output types**: Implement `first`, `array`, `object`, and `file`

## Related Documentation

- **[List Components](list-components.md)** - Retrieve all items
- **[Get Components](get-components.md)** - Get single item by ID
- **[Behavior Reference](behavior.md)** - Component behavior implementation
