# Part 1: Connectors - service.json

## Overview

The `service.json` file describes the connector service and its metadata. It's the first file users see when browsing available connectors.

## Example

```json
{
    "name": "appmixer.freshdesk",
    "label": "Freshdesk",
    "category": "applications",
    "description": "Freshdesk is a cloud-based helpdesk and customer support software. Connect with Freshdesk to manage support tickets, track customer interactions, and automate workflows.",
    "version": "1.0.0",
    "icon": "https://example.com/freshdesk-icon.svg"
}
```

## JSON Schema

```json
{
    "type": "object",
    "properties": {
        "name": {
            "type": "string",
            "description": "The name of the service, lower case. Format: appmixer.${CONNECTOR_NAME}. Example: appmixer.freshdesk"
        },
        "label": {
            "type": "string",
            "description": "The display label of the service. Used in the UI. Example: Freshdesk"
        },
        "category": {
            "type": "string",
            "description": "Category for organizing connectors. Use 'applications' by default."
        },
        "description": {
            "type": "string",
            "description": "Description of the service. Displayed in the UI inspector panel. Should be concise but informative."
        },
        "version": {
            "type": "string",
            "description": "Semantic version (e.g., 1.0.0). Should match bundle.json version."
        },
        "icon": {
            "type": "string",
            "description": "URL to the SVG icon of the application. Should be publicly accessible and represent the service brand."
        }
    },
    "required": ["name", "label", "category", "description", "version"]
}
```

## Field Guidelines

### name
- Format: `appmixer.${lowercasename}`
- Examples: `appmixer.freshdesk`, `appmixer.github`, `appmixer.slack`
- Must be unique across all connectors

### label
- Human-readable name
- Examples: "Freshdesk", "GitHub", "Slack"
- Used in UI dropdowns and component names

### category
- Use `"applications"` for most connectors
- Helps organize connectors in the UI

### description
- 1-2 sentences maximum
- Explain what the service does and primary use case
- Example: "Freshdesk is a cloud-based helpdesk platform for managing customer support tickets."

### version
- Follow semantic versioning (major.minor.patch)
- Should match version in `bundle.json`
- Start with "1.0.0" for new connectors

### icon
- Provide SVG for best quality
- SVG should be square (e.g., 100x100)
- URL must be publicly accessible
- Can use service's official brand assets

## Related Documentation

- **[bundle.json](bundle-json.md)** - Version management and changelog
- **[Connector Structure](structure.md)** - File organization
- **[Authentication Overview](../02-authentication/overview.md)** - How auth.js works with service metadata
