# Part 3: Components - Configuration (component.json)

## Overview

The `component.json` file defines the component's configuration, structure, and behavior metadata. It tells Appmixer how to display the component and what data it accepts/produces.

## Minimal Example

```json
{
    "name": "appmixer.service.core.GetTask",
    "description": "Retrieve a specific task by ID",
    "author": "Appmixer <info@appmixer.com>",
    "version": "1.0.0",
    "inPorts": [
        {
            "name": "in",
            "schema": {
                "type": "object",
                "properties": {
                    "taskId": { "type": "string" }
                },
                "required": ["taskId"]
            }
        }
    ],
    "outPorts": [
        {
            "name": "out",
            "options": [
                { "label": "Task ID", "value": "id" },
                { "label": "Title", "value": "title" },
                { "label": "Status", "value": "status" }
            ]
        }
    ]
}
```

## Full Configuration Reference

```json
{
    "name": "appmixer.vendor.module.ComponentName",
    "label": "Component Display Name",
    "description": "What this component does",
    "author": "Appmixer <info@appmixer.com>",
    "version": "1.0.0",
    "trigger": false,
    "tick": false,
    "webhook": false,
    "auth": {
        "service": "appmixer:vendor",
        "scope": ["scope1", "scope2"]
    },
    "quota": {
        "manager": "appmixer:vendor",
        "resources": "api.request",
        "scope": { "userId": "{{userId}}" }
    },
    "inPorts": [...],
    "outPorts": [...],
    "properties": {...},
    "icon": "https://example.com/icon.svg"
}
```

## Required Fields

### name
- **Format**: `appmixer.vendor.module.ComponentName`
- **Example**: `appmixer.github.core.GetRepository`
- **Rules**:
  - Must be unique
  - Use `core` for default module
  - Vendor name must match connector
  - Use PascalCase for component name

### inPorts or properties
- One of these must be defined
- `inPorts`: For regular components receiving input from upstream
- `properties`: For trigger components with static configuration

### outPorts
- Must be defined (can be empty array)
- Defines what data component produces

## Optional But Recommended

### label
- **Type**: `string`
- **Default**: Auto-generated from name
- **Example**: `"Get Repository"` (from `GetRepository`)
- **Use**: Override auto-generated label if needed

### description
- **Type**: `string`
- **Required**: Yes, include always
- **Example**: `"Fetch a GitHub repository by name"`
- **Shown**: In UI inspector panel

### author
- **Type**: `string`
- **Default**: `"Appmixer <info@appmixer.com>"`
- **Example**: `"Appmixer <info@appmixer.com>"`

### version
- **Type**: `string` (semantic versioning)
- **Example**: `"1.0.0"`
- **Must match**: `bundle.json` version

### icon
- **Type**: `string` (URL)
- **Format**: SVG URL
- **Size**: Square (e.g., 100x100)
- **Used**: Component representation in UI

## Component Type Flags

### trigger
- **Type**: `boolean`
- **Default**: `false`
- **Set to true**: For trigger/webhook components
- **Set to false**: For regular action components

### tick
- **Type**: `boolean`
- **Default**: `false`
- **Set to true**: For polling trigger components
- **Effect**: Component receives periodic `tick()` calls

### webhook
- **Type**: `boolean`
- **Default**: `false`
- **Set to true**: For webhook trigger components
- **Effect**: `context.getWebhookUrl()` becomes available

## Input & Output Ports

### inPorts
```json
"inPorts": [
    {
        "name": "in",
        "schema": { /* JSON Schema */ },
        "inspector": { /* UI configuration */ }
    }
]
```

### outPorts
```json
"outPorts": [
    {
        "name": "out",
        "options": [
            { "label": "Field Name", "value": "fieldKey" },
            { "label": "Another Field", "value": "anotherField" }
        ]
    }
]
```

## Authentication

```json
"auth": {
    "service": "appmixer:vendor",
    "scope": ["scope1", "scope2"]
}
```

- **service**: Format `appmixer:vendor` (matches connector name)
- **scope**: Optional array of scope parameters for auth.js

When `auth` is defined:
- User must connect account before using component
- Credentials available in component via `context.auth`

## Rate Limiting (Quota)

```json
"quota": {
    "manager": "appmixer:vendor",
    "resources": "api.request",
    "maxWait": 60000,
    "concurrency": 1,
    "scope": {
        "userId": "{{userId}}"
    }
}
```

- **manager**: Connector name (matches quota.js)
- **resources**: Resource ID from quota.js rules
- **maxWait**: Max milliseconds to wait (must be < 120,000)
- **concurrency**: Max concurrent calls
- **scope**: Per-user or global limits

## Properties (Static Configuration)

For components with static configuration (usually triggers):

```json
"properties": {
    "schema": {
        "type": "object",
        "properties": {
            "webhookUrl": { "type": "string" },
            "events": { "type": "array" }
        }
    },
    "inspector": { /* UI configuration */ }
}
```

## Attribute Ordering

For consistency, order attributes in this sequence:

1. `name`
2. `description`
3. `author`
4. `version`
5. `trigger`
6. `tick`
7. `webhook`
8. `auth`
9. `quota`
10. `inPorts`
11. `properties`
12. `outPorts`
13. `icon`

## Type Mapping for Inputs

Input field types must match schema types:

| Schema Type | Inspector Type |
|-------------|----------------|
| `string` | `text` or `textarea` |
| `integer` | `number` |
| `boolean` | `toggle` |
| `array` | `multiselect` or `filepicker` |
| `object` | (complex, see examples) |

## Dynamic Options

For fields with options from API:

```json
"inPorts": [{
    "name": "in",
    "inspector": {
        "inputs": {
            "projectId": {
                "type": "select",
                "source": {
                    "url": "/component/appmixer/vendor/core/ListProjects?outPort=out",
                    "data": {
                        "transform": "./transformers#projectsToOptions"
                    }
                }
            }
        }
    }
}]
```

## File Handling

For file input components:

```json
{
    "schema": {
        "properties": {
            "file": {
                "type": "string",
                "format": "data-url"
            }
        }
    },
    "inspector": {
        "inputs": {
            "file": {
                "type": "filepicker",
                "index": 1
            }
        }
    }
}
```

## Related Documentation

- **[Behavior (JavaScript)](behavior.md)** - Implementation details
- **[Component Types](types/)** - Specific patterns per type
- **[Development Guidelines](../05-best-practices/development-guidelines.md)** - component.json best practices
