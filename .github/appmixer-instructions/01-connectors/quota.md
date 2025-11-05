# Part 1: Connectors - quota.js

## Overview

The `quota.js` file defines rate limiting rules to prevent API quota violations. This is critical for external services with usage limits and rate restrictions.

## Example

```javascript
module.exports = {
    rules: [
        {
            limit: 2000,
            throttling: 'window-sliding',
            window: 1000 * 60 * 60 * 24,  // 24 hours in ms
            scope: 'userId',
            resource: 'tickets.get'
        },
        {
            limit: 3,
            window: 1000,  // 1 second
            throttling: 'window-sliding',
            queueing: 'fifo',
            resource: 'tickets.get',
            scope: 'userId'
        },
        {
            limit: 100,
            window: 1000 * 60 * 5,  // 5 minutes
            throttling: 'window-sliding',
            scope: 'global',
            resource: 'api.request'
        }
    ]
};
```

## Configuration Reference

### Rule Properties

#### limit (Required)
- **Type**: `integer`
- **Description**: Maximum number of calls allowed in the time window
- **Example**: `2000` calls per 24 hours

#### window (Required)
- **Type**: `integer` (milliseconds)
- **Description**: Time window duration
- **Examples**:
  - `1000` - 1 second
  - `1000 * 60` - 1 minute
  - `1000 * 60 * 5` - 5 minutes
  - `1000 * 60 * 60` - 1 hour
  - `1000 * 60 * 60 * 24` - 24 hours

#### throttling (Required)
- **Type**: `string` or `object`
- **Values**: 
  - `'window-sliding'` - Sliding window algorithm
  - Custom object with `type` and `getStartOfNextWindow` function
- **Description**: Algorithm for throttling requests

#### scope (Required)
- **Type**: `string`
- **Values**:
  - `'userId'` - Quota per individual user
  - `'global'` - Quota for entire application
- **Description**: Whether quota applies per-user or globally

#### resource (Required)
- **Type**: `string`
- **Description**: Identifier for the API resource/endpoint
- **Examples**: `'tickets.get'`, `'tickets.create'`, `'api.request'`
- **Note**: Components reference these in their manifest

#### queueing (Optional)
- **Type**: `string`
- **Values**: `'fifo'` (First In, First Out)
- **Description**: Queue strategy when rate limit is reached

#### maxWait (Optional)
- **Type**: `integer` (milliseconds)
- **Description**: Maximum time to wait before failing request
- **Constraint**: Must be lower than 120,000 (2 minutes) - default TTL

#### concurrency (Optional)
- **Type**: `integer`
- **Description**: Maximum concurrent requests for this rule

## Best Practices

### Multiple Rules for Tiered Limits

Most services have multiple rate limits. Use multiple rules:

```javascript
module.exports = {
    rules: [
        // Per-second limit (stricter)
        {
            limit: 3,
            window: 1000,
            throttling: 'window-sliding',
            scope: 'userId',
            resource: 'api.request'
        },
        // Per-minute limit (medium)
        {
            limit: 180,
            window: 1000 * 60,
            throttling: 'window-sliding',
            scope: 'userId',
            resource: 'api.request'
        },
        // Per-hour limit (relaxed)
        {
            limit: 10000,
            window: 1000 * 60 * 60,
            throttling: 'window-sliding',
            scope: 'userId',
            resource: 'api.request'
        }
    ]
};
```

### Separate Rules by Resource

Different endpoints may have different limits:

```javascript
module.exports = {
    rules: [
        // GET requests are cheaper
        {
            limit: 100,
            window: 1000 * 60,
            throttling: 'window-sliding',
            scope: 'userId',
            resource: 'tickets.list'
        },
        // POST requests are more expensive
        {
            limit: 10,
            window: 1000 * 60,
            throttling: 'window-sliding',
            scope: 'userId',
            resource: 'tickets.create'
        }
    ]
};
```

### Using Quota in Components

Reference the resource in component.json:

```json
{
    "name": "appmixer.freshdesk.core.ListTickets",
    "quota": {
        "manager": "appmixer:freshdesk",
        "resources": "tickets.list",
        "scope": {
            "userId": "{{userId}}"
        }
    }
}
```

## Common Service Limits

### Freshdesk
```javascript
{
    limit: 2000,
    window: 1000 * 60 * 60 * 24,  // 2000 per 24 hours
    throttling: 'window-sliding',
    scope: 'userId',
    resource: 'api.request'
}
```

### GitHub
```javascript
{
    limit: 5000,
    window: 1000 * 60 * 60,  // 5000 per hour
    throttling: 'window-sliding',
    scope: 'userId',
    resource: 'api.request'
}
```

### Slack
```javascript
{
    limit: 60,
    window: 1000,  // 60 per second
    throttling: 'window-sliding',
    scope: 'global',
    resource: 'api.request'
}
```

## Related Documentation

- **[Connector Structure](structure.md)** - File organization
- **[Components Configuration](../03-components/configuration.md)** - How components use quota
- **[Development Guidelines](../05-best-practices/development-guidelines.md)** - Rate limiting best practices
