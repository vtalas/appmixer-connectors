# Part 1: Connectors - bundle.json

## Overview

The `bundle.json` file contains bundle metadata and version history. It tracks changes and helps manage connector versioning.

## Example

```json
{
    "name": "appmixer.freshdesk",
    "version": "1.0.0",
    "changelog": {
        "1.0.0": [
            "Initial release with ticket management components."
        ],
        "1.0.1": [
            "Fixed authentication timeout issues.",
            "Added support for custom fields in tickets."
        ],
        "1.1.0": [
            "Added new Contact management components.",
            "Improved error handling for API calls."
        ],
        "2.0.0": [
            "(breaking change) Updated API integration to v2.",
            "Refactored component naming for consistency."
        ]
    }
}
```

## JSON Schema

```json
{
    "type": "object",
    "properties": {
        "name": {
            "type": "string",
            "description": "The bundle name. Must match service.json name. Format: appmixer.${CONNECTOR_NAME}"
        },
        "version": {
            "type": "string",
            "description": "Current bundle version using semantic versioning (major.minor.patch)"
        },
        "changelog": {
            "type": "object",
            "description": "Version history with changes for each release",
            "additionalProperties": {
                "type": "array",
                "items": { "type": "string" }
            }
        }
    },
    "required": ["name", "version", "changelog"]
}
```

## Field Guidelines

### name
- Must match the `name` field in `service.json`
- Format: `appmixer.${lowercasename}`
- Example: `appmixer.freshdesk`

### version
- Follow semantic versioning: `major.minor.patch`
- Examples: `1.0.0`, `1.0.1`, `1.1.0`, `2.0.0`
- Should match version in `service.json`

### changelog
- Key: Version number (e.g., "1.0.0")
- Value: Array of strings describing changes
- Use past tense ("Added", "Fixed", "Improved")
- For breaking changes, prefix with "(breaking change)"

## Changelog Best Practices

### Version Format
```
1.0.0 → 1.0.1  # Patch: bug fixes only
1.0.0 → 1.1.0  # Minor: new features, backward compatible
1.0.0 → 2.0.0  # Major: breaking changes
```

### Example Entries

**Good**:
```json
"1.0.1": [
    "Fixed null pointer exception in GetTicket component.",
    "Improved error message clarity for invalid API keys.",
    "Updated dependencies for security patch."
]
```

**Breaking Change**:
```json
"2.0.0": [
    "(breaking change) Migrated to Freshdesk API v2.",
    "(breaking change) Renamed GetTicket to FetchTicket for consistency.",
    "Added support for extended ticket fields.",
    "Improved pagination for ticket listing."
]
```

### Change Categories
- ✨ **New**: New components or features
- 🐛 **Fixed**: Bug fixes
- 🔧 **Improved**: Performance or UX improvements
- 🔄 **Updated**: Dependency updates or refactoring
- ⚠️ **(breaking change)**: Changes requiring user action

## Initial Version

For new connectors, start with `1.0.0`:

```json
{
    "name": "appmixer.myservice",
    "version": "1.0.0",
    "changelog": {
        "1.0.0": [
            "Initial release with basic component support."
        ]
    }
}
```

## Related Documentation

- **[service.json](service-json.md)** - Service metadata
- **[Connector Structure](structure.md)** - File organization
- **[Authentication Overview](../02-authentication/overview.md)** - How versions affect auth stability
