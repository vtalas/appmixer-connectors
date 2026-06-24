---
description: Convert an n8n node to Appmixer connector
argument-hint: <connector-name>
---

# Convert n8n Node to Appmixer Connector

Convert an n8n node from the n8n repository to an Appmixer connector.
Repository url: git@github.com:n8n-io/n8n.git

## Arguments
- Connector name: `$1` (e.g., `box`)

## Overview

This command converts an n8n node to an Appmixer connector by:
1. Parsing the n8n node structure
2. Extracting operations and field definitions
3. Generating Appmixer component files

## n8n Node Structure

Typical n8n node structure:
```
<NodeName>/
├── <NodeName>.node.ts       # Main node with execute() logic
├── <NodeName>.node.json     # Node metadata
├── <NodeName>Trigger.node.ts # Trigger node (optional)
├── <Resource>Description.ts  # Field definitions per resource
├── GenericFunctions.ts       # Shared API helpers
└── icon.png/svg             # Node icon
```

## Appmixer Connector Structure

Target Appmixer structure:
```
<connector_name>/
├── service.json             # Service metadata
├── auth.js                  # OAuth2/API key configuration
├── bundle.json              # Version info
├── lib.js                   # Shared helpers
├── quota.js                 # Rate limiting (optional)
└── core/
    └── <ComponentName>/
        ├── component.json   # Component config
        └── <ComponentName>.js # Component logic
```

## Conversion Steps

### Step 1: Analyze n8n Node

1. **Read the main node file** (`<NodeName>.node.ts`):
   - Extract `description.credentials` → for auth.js
   - Extract `description.properties` → resources and operations
   - Extract `execute()` method → component logic

2. **Read Description files** (`<Resource>Description.ts`):
   - Extract `<resource>Operations` → list of operations (components to create)
   - Extract `<resource>Fields` → input field definitions

3. **Read GenericFunctions.ts**:
   - Extract API base URL
   - Extract request helper functions → for lib.js

### Step 2: Create Appmixer Connector Structure

1. **Create service.json**:
```json
{
    "name": "appmixer.<connector>",
    "label": "<ConnectorName>",
    "category": "applications",
    "description": "<from n8n node description>",
    "version": "1.0.0",
    "icon": "<base64 encoded icon>"
}
```

2. **Create auth.js** based on n8n credential type:
   - `OAuth2Api` → `type: 'oauth2'`
   - `Api` → `type: 'apiKey'`

3. **Create bundle.json**:
```json
{
    "name": "appmixer.<connector>",
    "version": "1.0.0",
    "changelog": {
        "1.0.0": ["Initial version"]
    }
}
```

### Step 3: Convert Operations to Components

For each operation in the n8n node:

1. **Create component folder**: `core/<ComponentName>/`

2. **Generate component.json**:

```javascript
// Mapping n8n field to Appmixer
function convertField(n8nField) {
    const field = {
        name: n8nField.name,
        schema: {
            type: mapType(n8nField.type),
            // Add format if dateTime
        },
        inspector: {
            type: mapInspectorType(n8nField.type),
            label: n8nField.displayName,
            tooltip: n8nField.description,
            index: <sequential>
        }
    };

    // Handle required
    if (n8nField.required) {
        // Add to schema.required array
    }

    // Handle options (for select type)
    if (n8nField.options) {
        field.inspector.options = n8nField.options.map(opt => ({
            label: opt.name,
            value: opt.value
        }));
    }

    return field;
}
```

3. **Generate component.js**:

```javascript
// Template for component behavior
module.exports = {
    async receive(context) {
        const { field1, field2 } = context.messages.in.content;

        // Validation
        if (!requiredField) {
            throw new context.CancelError('Field is required!');
        }

        // API call (converted from n8n's boxApiRequest)
        const { data } = await context.httpRequest({
            method: '<METHOD>',
            url: '<API_URL>',
            headers: {
                'Authorization': `Bearer ${context.auth.accessToken}`
            },
            data: { ... }
        });

        return context.sendJson(data, 'out');
    }
};
```

### Step 4: Type Mapping Reference

| n8n Type | Appmixer Schema | Appmixer Inspector |
|----------|-----------------|-------------------|
| `string` | `"type": "string"` | `"type": "text"` |
| `boolean` | `"type": "boolean"` | `"type": "toggle"` |
| `number` | `"type": "number"` | `"type": "number"` |
| `options` | `"type": "string"` | `"type": "select"` with `options` |
| `dateTime` | `"type": "string", "format": "date-time"` | `"type": "date-time"` |
| `multiOptions` | `"type": ["array", "string"]` | `"type": "multiselect"` |
| `collection` | Flatten to individual optional fields | Individual inputs |
| `fixedCollection` | Flatten or use structured object | Individual inputs |

### Step 5: Handle Special Cases

#### n8n's displayOptions
n8n uses `displayOptions.show` to conditionally display fields based on other field values.
Appmixer doesn't have this feature, so:
- **Option A**: Create separate components for each combination
- **Option B**: Include all fields as optional

#### n8n's additionalFields/options
These are typically `collection` types with optional fields.
In Appmixer, flatten them into regular optional input fields.

#### n8n's Binary Data
- n8n's `binaryPropertyName` → Appmixer's `"type": "filepicker"` input
- n8n's binary output → Appmixer's `context.saveFileStream()`

#### n8n's returnAll/limit
- n8n often has `returnAll` boolean + `limit` number
- Appmixer uses `outputType` with options: first, array, object, file
- Do NOT include limit/offset in Appmixer (use API's max internally)

### Step 6: Component Naming Convention

Map n8n operation names to Appmixer component names:

| n8n Operation | Appmixer Component |
|---------------|-------------------|
| `get` | `Get<Resource>` |
| `getAll` / `search` | `Find<Resources>` or `List<Resources>` |
| `create` | `Create<Resource>` |
| `update` | `Update<Resource>` |
| `delete` | `Delete<Resource>` |
| `upload` | `Upload<Resource>` |
| `download` | `Download<Resource>` |
| `copy` | `Copy<Resource>` |
| `share` | `Share<Resource>` |

### Step 7: Output Port Schema

For each component, define output schema based on API response:
1. Check n8n's API documentation links in comments
2. Define `outPorts.options` with field labels and value paths
3. Follow Appmixer naming conventions:
   - Service entity IDs → use label "ID"
   - Appmixer file IDs → use label "File ID"
   - Names → use label "Name"

## Example Conversion

### n8n Field Definition:
```typescript
{
    displayName: 'File ID',
    name: 'fileId',
    type: 'string',
    required: true,
    displayOptions: {
        show: {
            operation: ['get'],
            resource: ['file'],
        },
    },
    default: '',
    description: 'The ID of the file to retrieve',
}
```

### Appmixer component.json:
```json
{
    "inPorts": [{
        "name": "in",
        "schema": {
            "type": "object",
            "properties": {
                "fileId": {
                    "type": "string"
                }
            },
            "required": ["fileId"]
        },
        "inspector": {
            "inputs": {
                "fileId": {
                    "type": "text",
                    "label": "File ID",
                    "tooltip": "The ID of the file to retrieve.",
                    "index": 1
                }
            }
        }
    }]
}
```

## Limitations

1. **Conditional fields**: n8n's displayOptions can't be directly converted
2. **Complex nested structures**: May need manual adjustment
3. **Webhooks**: n8n trigger nodes need separate conversion logic
4. **Pagination**: n8n's returnAll pattern differs from Appmixer's outputType
