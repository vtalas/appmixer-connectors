# Part 1: Connectors - Structure

## Connector Directory Structure

```
connector_name/
├── service.json       # Service metadata and description
├── auth.js           # Authentication configuration
├── bundle.json       # Bundle metadata and changelog
├── package.json      # Dependencies (optional)
├── quota.js          # Rate limiting rules (optional)
└── core/             # Default module for components
    ├── ComponentName/
    │   ├── ComponentName.js    # Component behavior/logic
    │   └── component.json      # Component configuration
    └── AnotherComponent/
        ├── AnotherComponent.js
        └── component.json
```

## File Breakdown

### Required Files

- **service.json** - Connector metadata (name, version, icon, description)
- **auth.js** - Authentication mechanism (API Key or OAuth2)
- **bundle.json** - Version history and changelog
- **core/** - Directory containing all components

### Optional Files

- **package.json** - NPM dependencies for the connector
- **quota.js** - Rate limiting rules for API quota management
- **jobs.js** - Background jobs (if using plugins)
- **routes.js** - Custom routes (if using plugins)
- **plugin.js** - Plugin initialization (if using plugins)

## Component Structure Within Connector

Each component is a subdirectory under `core/` containing:

```
ComponentName/
├── ComponentName.js      # Behavior implementation
└── component.json        # Configuration manifest
```

## Naming Conventions

- Connector directory: `lowercasename` (e.g., `freshdesk`, `github`)
- Component directory: `PascalCase` (e.g., `GetTicket`, `CreateRepository`)
- Component files: `PascalCase` (e.g., `GetTicket.js`)

## Related Documentation

- **[service.json](service-json.md)** - Service metadata configuration
- **[bundle.json](bundle-json.md)** - Bundle versioning
- **[quota.js](quota.md)** - Rate limiting configuration
- **[Overview](overview.md)** - Connector fundamentals

---

**See Also**: 
- [Components Overview](../03-components/overview.md) for component structure details
- [Authentication Overview](../02-authentication/overview.md) for auth.js details
