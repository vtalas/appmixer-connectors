# Part 1: Connectors - Overview

## What are Connectors?

Connectors are integrations with external services. Each connector contains authentication logic, service metadata, and one or more components that perform specific actions.

Appmixer is a workflow engine that allows end-users to create business processes using a drag-and-drop UI without writing code. Connectors bridge the gap between Appmixer and external services like Slack, Salesforce, GitHub, etc.

## Key Responsibilities of a Connector

1. **Authentication** - Handles how users authenticate with the external service
2. **Service Metadata** - Defines the connector's name, description, version, and icon
3. **Rate Limiting** - Prevents API quota violations through quota rules
4. **Components** - Provides reusable actions and triggers for workflows

## Connector Scope

- One connector = One external service
- Multiple components per connector
- Each component performs a specific action or trigger

## Related Documentation

- **[Connector Structure](structure.md)** - How connectors are organized
- **[service.json](service-json.md)** - Service metadata
- **[bundle.json](bundle-json.md)** - Version management
- **[quota.js](quota.md)** - Rate limiting rules
