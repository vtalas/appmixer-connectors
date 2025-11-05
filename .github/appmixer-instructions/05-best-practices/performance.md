# Part 5: Best Practices - Performance Considerations

## Overview

Performance optimization ensures components run efficiently, respect API limits, and provide good user experience. These considerations apply at design, implementation, and deployment levels.

## Caching Strategies

### Cache Frequently Accessed Data

**Problem**: Repeated API calls for same data waste bandwidth and hit rate limits.

**Solution**: Cache results with TTL:

```javascript
module.exports = {
    async receive(context) {
        const { projectId } = context.messages.in.content;

        // Check cache
        if (context.cache?.projects?.[projectId]) {
            return context.sendJson(context.cache.projects[projectId], 'out');
        }

        // Fetch if not cached
        const response = await context.httpRequest({
            method: 'GET',
            url: `https://api.service.com/projects/${projectId}`
        });

        // Cache result (in-memory, expires after component run)
        if (!context.cache) context.cache = {};
        if (!context.cache.projects) context.cache.projects = {};
        context.cache.projects[projectId] = response.data;

        return context.sendJson(response.data, 'out');
    }
};
```

### Cache User Lists

When a component needs to map users by ID:

```javascript
async receive(context) {
    const users = await fetchUserListOnce(context);
    const userMap = {};
    
    for (const user of users) {
        userMap[user.id] = user;
    }

    return context.sendJson(userMap, 'out');
}

async function fetchUserListOnce(context) {
    if (context.userCache) return context.userCache;

    const response = await context.httpRequest({
        method: 'GET',
        url: 'https://api.service.com/users',
        params: { limit: 1000 }
    });

    context.userCache = response.data.users;
    return context.userCache;
}
```

### Cache Configuration

```javascript
// Store configuration values
async receive(context) {
    // Get config once
    const config = context.config || await fetchConfig();
    context.config = config;

    // Use throughout component
    const baseUrl = context.config.baseUrl;
    const apiVersion = context.config.apiVersion;
}
```

## Pagination Handling

### Fetch All Items with Pagination

For APIs with pagination, iterate through all pages:

```javascript
async function fetchAllItems(context) {
    const allItems = [];
    let pageToken = null;

    do {
        const params = {
            pageSize: 100,  // Use maximum
            pageToken
        };

        const response = await context.httpRequest({
            method: 'GET',
            url: 'https://api.service.com/items',
            params
        });

        allItems.push(...(response.data.items || []));
        pageToken = response.data.nextPageToken;

        // Avoid infinite loops
        if (!pageToken) break;
    } while (pageToken);

    return allItems;
}
```

### Cursor-Based Pagination

Some APIs use cursor-based pagination:

```javascript
async function fetchAllItemsCursor(context) {
    const allItems = [];
    let cursor = null;

    do {
        const params = { limit: 100 };
        if (cursor) params.after = cursor;

        const response = await context.httpRequest({
            method: 'GET',
            url: 'https://api.service.com/items',
            params
        });

        allItems.push(...(response.data.items || []));
        cursor = response.data.pagination?.next;
    } while (cursor);

    return allItems;
}
```

### Offset Pagination

For traditional offset/limit:

```javascript
async function fetchAllItemsOffset(context) {
    const allItems = [];
    let offset = 0;
    const limit = 100;
    let total = null;

    do {
        const response = await context.httpRequest({
            method: 'GET',
            url: 'https://api.service.com/items',
            params: { offset, limit }
        });

        allItems.push(...(response.data.items || []));
        total = response.data.total || 0;
        offset += limit;
    } while (offset < total);

    return allItems;
}
```

## Concurrency Control

### Limit Parallel Requests

Making too many simultaneous requests can overwhelm the API and your system.

**Problem**: Uncontrolled concurrency

```javascript
// ❌ WRONG - Creates 1000 simultaneous requests
const tasks = await getTaskIds();
const promises = tasks.map(id => 
    context.httpRequest({ url: `api.service.com/tasks/${id}` })
);
await Promise.all(promises);
```

**Solution**: Batch or limit concurrency

```javascript
// ✅ CORRECT - Process in batches of 10
async function processBatch(context, items, batchSize = 10) {
    const results = [];

    for (let i = 0; i < items.length; i += batchSize) {
        const batch = items.slice(i, i + batchSize);
        const promises = batch.map(item => processItem(context, item));
        results.push(...await Promise.all(promises));
    }

    return results;
}
```

### Use Semaphore for Fine Control

```javascript
async function processConcurrently(
    context,
    items,
    maxConcurrency = 5
) {
    const results = [];
    const queue = [...items];
    const running = [];

    while (queue.length > 0 || running.length > 0) {
        // Start new tasks if under limit
        while (running.length < maxConcurrency && queue.length > 0) {
            const item = queue.shift();
            const promise = processItem(context, item)
                .then(result => {
                    running.splice(running.indexOf(promise), 1);
                    results.push(result);
                });
            running.push(promise);
        }

        // Wait for next task to complete
        if (running.length > 0) {
            await Promise.race(running);
        }
    }

    return results;
}
```

## Rate Limiting Integration

### Respect API Rate Limits

Define quota in `quota.js`:

```javascript
module.exports = {
    rules: [
        {
            limit: 60,
            window: 1000,  // 60 requests per second
            resource: 'api.read',
            scope: 'userId'
        }
    ]
};
```

Reference in component:

```json
{
    "quota": {
        "manager": "appmixer:service",
        "resources": "api.read",
        "scope": { "userId": "{{userId}}" }
    }
}
```

### Handle Rate Limit Responses

```javascript
async function fetchWithRetry(context, config, maxRetries = 3) {
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
            return await context.httpRequest(config);
        } catch (error) {
            if (error.status === 429) {  // Rate limited
                const retryAfter = parseInt(
                    error.headers['retry-after'] || 60
                );
                
                if (attempt < maxRetries) {
                    await sleep(retryAfter * 1000);
                    continue;
                }
            }
            throw error;
        }
    }
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
```

## Batching Operations

### Batch API Calls

Instead of individual requests:

```javascript
// ❌ SLOW - N API calls
for (const id of ids) {
    await updateItem(id, newValue);
}

// ✅ FASTER - 1 API call
const updates = ids.map(id => ({ id, value: newValue }));
await context.httpRequest({
    method: 'PATCH',
    url: 'https://api.service.com/items/batch',
    data: { updates }
});
```

### Batch Query Operations

```javascript
// ❌ SLOW - Search N times
const results = [];
for (const query of queries) {
    const response = await search(query);
    results.push(...response.items);
}

// ✅ FASTER - Single batched search
const response = await context.httpRequest({
    method: 'POST',
    url: 'https://api.service.com/search/batch',
    data: { queries }
});
const results = response.data.results;
```

## Locking for Shared Resources

### Prevent Race Conditions

When multiple workflows access the same resource:

```javascript
const locks = {};

async function acquireLock(resourceId, timeout = 5000) {
    const startTime = Date.now();
    
    while (locks[resourceId]) {
        if (Date.now() - startTime > timeout) {
            throw new Error(`Lock timeout for ${resourceId}`);
        }
        await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    locks[resourceId] = true;
}

function releaseLock(resourceId) {
    delete locks[resourceId];
}

// Usage
async function updateSharedResource(context, resourceId, updates) {
    await acquireLock(resourceId);
    try {
        const current = await fetchResource(resourceId);
        const updated = { ...current, ...updates };
        await saveResource(resourceId, updated);
    } finally {
        releaseLock(resourceId);
    }
}
```

## Memory Optimization

### Stream Large Files

For file operations, use streams instead of loading entire file:

```javascript
// ❌ WRONG - Loads entire file into memory
const fileContent = fs.readFileSync('large-file.csv', 'utf8');

// ✅ CORRECT - Streams file
const stream = fs.createReadStream('large-file.csv');
stream.on('data', chunk => processChunk(chunk));
```

### Lazy Load Data

```javascript
// ❌ WRONG - Load everything upfront
const allUsers = await fetchAllUsers();
const allProjects = await fetchAllProjects();
// ... only use some of them

// ✅ CORRECT - Load on demand
const users = await fetchUsers(filter);
const projects = await fetchProjects(filter);
```

## Database Query Optimization

### Use Indexes for Frequently Queried Fields

```javascript
// In database setup
db.collection('tasks').createIndex({ userId: 1, createdAt: -1 });

// Query with indexed fields
const tasks = await db.collection('tasks')
    .find({ userId })
    .sort({ createdAt: -1 })
    .limit(100)
    .toArray();
```

### Projection to Limit Fields

```javascript
// ❌ WRONG - Fetch all fields
const task = await db.collection('tasks').findOne({ id });

// ✅ CORRECT - Only fetch needed fields
const task = await db.collection('tasks').findOne(
    { id },
    { projection: { id: 1, title: 1, status: 1 } }
);
```

## Timeout Management

### Set Reasonable Timeouts

```javascript
// ❌ WRONG - No timeout
const response = await fetch(url);

// ✅ CORRECT - Set timeout
const controller = new AbortController();
const timeoutId = setTimeout(() => controller.abort(), 5000);

try {
    const response = await fetch(url, { signal: controller.signal });
    return response;
} finally {
    clearTimeout(timeoutId);
}
```

### Handle Timeout Gracefully

```javascript
async function fetchWithTimeout(context, config, timeout = 5000) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
        return await context.httpRequest({
            ...config,
            signal: controller.signal
        });
    } catch (error) {
        if (error.name === 'AbortError') {
            throw new context.CancelError(
                `Request timeout after ${timeout}ms`
            );
        }
        throw error;
    } finally {
        clearTimeout(timeoutId);
    }
}
```

## Monitoring Performance

### Log Execution Time

```javascript
async receive(context) {
    const startTime = Date.now();

    try {
        const response = await context.httpRequest({ /* ... */ });
        return context.sendJson(response.data, 'out');
    } finally {
        const duration = Date.now() - startTime;
        context.log('info', 'Component executed', {
            duration,
            componentId: context.componentId
        });
    }
}
```

### Track API Call Metrics

```javascript
async function fetchWithMetrics(context, url) {
    const startTime = Date.now();
    
    try {
        const response = await context.httpRequest({ url });
        context.log('info', 'API call successful', {
            duration: Date.now() - startTime,
            status: response.status
        });
        return response;
    } catch (error) {
        context.log('error', 'API call failed', {
            duration: Date.now() - startTime,
            status: error.status
        });
        throw error;
    }
}
```

## Performance Checklist

- [ ] Cache frequently accessed data
- [ ] Handle pagination correctly
- [ ] Limit concurrent requests
- [ ] Use batch operations when possible
- [ ] Define appropriate rate limits (quota.js)
- [ ] Implement locking for shared resources
- [ ] Stream large files
- [ ] Use database projections
- [ ] Set timeouts
- [ ] Log performance metrics
- [ ] Test with production data volumes

## Related Documentation

- **[Code Style](code-style.md)** - Writing efficient code
- **[Development Guidelines](development-guidelines.md)** - Requirements
- **[Common Patterns](common-patterns.md)** - Reusable patterns
