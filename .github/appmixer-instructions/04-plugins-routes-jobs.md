# Part 4: Plugins, Routes, and Jobs

## Overview

Plugins, routes, and jobs extend connector functionality beyond individual components. They handle advanced use cases like webhooks, background processing, and custom API endpoints.

## File Organization

```
connector_name/
├── plugin.js       # Plugin initialization and lifecycle
├── routes.js       # Custom HTTP endpoints
├── jobs.js         # Background job definitions
└── ... (other files)
```

## Plugins (plugin.js)

Plugins initialize connector-level functionality and manage lifecycle events.

### Basic Structure

```javascript
module.exports = {
    
    async init(context) {
        // Called when connector is initialized
        // Setup shared resources, database connections, etc.
        context.log('info', 'Connector initialized');
    },

    async destroy(context) {
        // Called when connector is shutting down
        // Clean up resources
        context.log('info', 'Connector destroyed');
    }
};
```

### Plugin Context

```javascript
{
    log: (level, message, data) => {},
    config: { /* connector configuration */ },
    // ... additional plugin-specific properties
}
```

## Routes (routes.js)

Routes create custom HTTP endpoints for the connector. Useful for webhooks, callbacks, or custom integrations.

### Basic Structure

```javascript
module.exports = {
    
    'POST /webhook': async (req, res) => {
        // Handle incoming webhook request
        const payload = req.body;
        
        // Process webhook
        await processWebhook(payload);
        
        res.status(200).json({ success: true });
    },

    'POST /callback': async (req, res) => {
        // Handle OAuth callback or other callbacks
        const code = req.query.code;
        
        // Process callback
        res.status(200).redirect('/dashboard');
    },

    'GET /status': async (req, res) => {
        // Health check endpoint
        res.status(200).json({ status: 'healthy' });
    }
};
```

### Route Parameters

Routes can access:

```javascript
{
    req: {
        body: {},           // POST/PUT body
        query: {},          // Query parameters
        params: {},         // URL path parameters
        headers: {},        // HTTP headers
        method: 'GET|POST|PUT|DELETE'
    },
    res: {
        status(code),       // Set HTTP status
        json(data),         // Send JSON response
        send(data),         // Send response
        redirect(url),      // Redirect
        setHeader(k, v),    // Set response header
    }
}
```

### Example: Custom Webhook Endpoint

```javascript
module.exports = {
    
    'POST /webhook/tasks': async (req, res) => {
        const { event, data } = req.body;
        
        // Validate webhook source
        const signature = req.headers['x-webhook-signature'];
        if (!validateSignature(data, signature)) {
            return res.status(401).json({ error: 'Invalid signature' });
        }

        try {
            // Process based on event type
            switch (event) {
                case 'task.created':
                    await handleTaskCreated(data);
                    break;
                case 'task.updated':
                    await handleTaskUpdated(data);
                    break;
                case 'task.deleted':
                    await handleTaskDeleted(data);
                    break;
            }

            res.status(200).json({ received: true });
        } catch (error) {
            console.error('Webhook processing error:', error);
            res.status(500).json({ error: 'Processing failed' });
        }
    }
};

function validateSignature(data, signature) {
    // Implement signature validation
    return true;
}

async function handleTaskCreated(data) {
    // Implementation
}

async function handleTaskUpdated(data) {
    // Implementation
}

async function handleTaskDeleted(data) {
    // Implementation
}
```

## Jobs (jobs.js)

Jobs are background tasks that run periodically or on-demand to perform batch operations.

### Basic Structure

```javascript
module.exports = {
    
    async 'cleanup-old-data'(context) {
        // Run cleanup job
        const deleted = await deleteOldData(context);
        context.log('info', 'Cleanup completed', { deleted });
    },

    async 'sync-users'(context) {
        // Run user synchronization
        const synced = await syncAllUsers(context);
        context.log('info', 'Sync completed', { synced });
    }
};
```

### Job Context

```javascript
{
    log: (level, message, data) => {},
    config: {},
    // job-specific properties
}
```

### Example: Batch Data Synchronization

```javascript
module.exports = {
    
    async 'sync-all-users'(context) {
        context.log('info', 'Starting user sync job');
        
        try {
            const response = await fetch('https://api.service.com/users', {
                headers: {
                    'Authorization': `Bearer ${context.config.apiKey}`
                }
            });

            const users = await response.json();
            
            // Batch process users
            let processed = 0;
            for (const user of users) {
                await saveUserToDatabase(user);
                processed++;
            }

            context.log('info', 'User sync completed', { 
                total: users.length, 
                processed 
            });

            return { success: true, processed };
        } catch (error) {
            context.log('error', 'User sync failed', { error: error.message });
            throw error;
        }
    },

    async 'cleanup-old-webhooks'(context) {
        context.log('info', 'Starting webhook cleanup');
        
        const cutoffDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000); // 30 days
        const deleted = await deleteWebhooksBefore(cutoffDate);

        context.log('info', 'Webhook cleanup completed', { deleted });
        return { deleted };
    }
};

async function saveUserToDatabase(user) {
    // Implementation
}

async function deleteWebhooksBefore(date) {
    // Implementation
    return 0;
}
```

## Important Limitations

### ⚠️ Pod-Level Constraints

Plugin code runs on pods that **only load files from the connector root directory**. This means:

```javascript
// ❌ DON'T - Will fail, can't require from component subdirectories
const helper = require('./core/tasks/helper.js');

// ✅ DO - Keep helpers in root or re-export from root
const helper = require('./shared-helper.js');
```

### Solution: Root-Level Helpers

Create shared helpers at the connector root:

```
connector_name/
├── plugin.js
├── routes.js
├── jobs.js
├── shared-helper.js      // ✅ Accessible
├── models.js             // ✅ Accessible
└── core/
    └── MyComponent/
        └── ... (not accessible from plugin)
```

### Accessing Component Helpers

If you need helpers from components, re-export them at root:

```javascript
// connector_name/index.js
module.exports = {
    helpers: require('./core/tasks/helper.js'),
    models: require('./core/models.js')
};

// connector_name/plugin.js
const { helpers, models } = require('./index.js');

// Now you can use them
```

## Context Object

All three (plugin, routes, jobs) have access to context:

```javascript
{
    log: (level, message, data) => {
        // level: 'info', 'warn', 'error'
        // message: string message
        // data: optional additional data object
    },
    config: {
        // Connector configuration
        // May include API keys, settings, etc.
    },
    // Additional properties depending on type
}
```

### Logging Format

```javascript
context.log('info', 'Operation completed', { itemCount: 5, duration: 123 });
context.log('warn', 'Unusual condition detected', { threshold: 100, actual: 150 });
context.log('error', 'Operation failed', { error: errorMessage });
```

## Usage Patterns

### Plugin: Initialize Shared Cache

```javascript
module.exports = {
    async init(context) {
        // Create shared cache
        context.cache = {};
        context.log('info', 'Cache initialized');
    },

    async destroy(context) {
        context.cache = null;
        context.log('info', 'Cache cleared');
    }
};
```

### Routes: Webhook Handler with Validation

```javascript
module.exports = {
    'POST /webhook': async (req, res) => {
        // Validate webhook
        if (!req.body || !req.body.event) {
            return res.status(400).json({ error: 'Missing event' });
        }

        // Process webhook asynchronously
        processWebhookAsync(req.body).catch(err => {
            console.error('Async webhook processing failed:', err);
        });

        // Return immediately
        res.status(202).json({ accepted: true });
    }
};

async function processWebhookAsync(payload) {
    // Do work here
}
```

### Jobs: Periodic Maintenance

```javascript
module.exports = {
    async 'maintenance'(context) {
        context.log('info', 'Running maintenance job');
        
        try {
            // Clean up resources
            await cleanupExpiredData(context);
            
            // Verify integrations
            await verifyConnections(context);
            
            context.log('info', 'Maintenance completed');
        } catch (error) {
            context.log('error', 'Maintenance failed', { error: error.message });
        }
    }
};

async function cleanupExpiredData(context) {
    // Implementation
}

async function verifyConnections(context) {
    // Implementation
}
```

## Best Practices

1. **Use root-level files**: Keep all plugin/route/job dependencies at connector root
2. **Log extensively**: Use context.log for debugging and monitoring
3. **Handle errors**: Always wrap jobs in try-catch
4. **Validate inputs**: Check req.body, req.query, etc. in routes
5. **Use async/await**: Keep code readable and maintainable
6. **Document endpoints**: Add comments explaining route purposes
7. **Security first**: Validate signatures, authenticate requests
8. **Graceful failures**: Let jobs complete partially rather than fail entirely

## Related Documentation

- **[Component Behavior](03-components/behavior.md)** - Component implementation
- **[Development Guidelines](05-best-practices/development-guidelines.md)** - Code standards
- **[Best Practices](05-best-practices/)** - General recommendations
