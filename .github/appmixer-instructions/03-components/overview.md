# Part 3: Components - Overview

## What are Components?

Components are the building blocks of workflows. Each component performs a specific action like sending an email, creating a task, or fetching data. Users drag and drop components onto the canvas to create workflows.

## Key Characteristics

- **Self-contained**: Each component is independent
- **Reusable**: Can be used in multiple workflows
- **Focused**: Does one thing well
- **Configurable**: Users can customize inputs and options

## Component Types

### Action Components

Components that perform operations when triggered by input data.

**Examples**:
- **Get**: Retrieve single item by ID
- **Find/List**: Search or retrieve multiple items
- **Create**: Create new items
- **Update**: Modify existing items
- **Delete**: Remove items

### Trigger Components

Components that monitor for events and start workflows.

**Examples**:
- **New Item**: Trigger when new item created
- **Updated Item**: Trigger when item modified
- **Webhook**: Trigger on incoming webhook

## Component Structure

Each component consists of two files:

```
ComponentName/
├── component.json      # Configuration manifest
└── ComponentName.js    # Behavior implementation
```

## Component Manifest (component.json)

Defines:
- Component name and description
- Input ports (inPorts) - data coming IN
- Output ports (outPorts) - data going OUT
- Authentication requirements
- Rate limiting configuration

## Component Behavior (ComponentName.js)

Implements:
- `receive()` - Handle input and perform action
- `tick()` - Periodic polling (for triggers)
- `webhook()` - Handle webhooks (for webhook components)

## General Principle

**Golden Rule**: For components that require an ID as input, there must be another component that returns the entity from which the ID can be obtained.

**Example**: If you create a `GetEmail` component that takes `emailId` as input, you must also create a `FindEmails` component that returns email entities with their IDs.

## Naming Conventions

- Component directory: `PascalCase` (e.g., `GetTicket`, `FindTasks`, `CreateComment`)
- Component class: `PascalCase` (e.g., `GetTicket.js`)
- Component manifest: `component.json` (fixed)

## Related Documentation

- **[Configuration (component.json)](configuration.md)** - Full manifest schema
- **[Behavior (JavaScript)](behavior.md)** - Implementation patterns
- **[Component Types](types/)** - Specific patterns for each component type
