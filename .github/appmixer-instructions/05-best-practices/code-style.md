# Part 5: Best Practices - Code Style

## Overview

Code style guidelines ensure consistency and maintainability across the Appmixer connector ecosystem. These standards apply to all connector code including components, authentication, routes, and jobs.

## Indentation and Spacing

### Use 4 Spaces

```javascript
// ✅ CORRECT - 4 spaces
function example() {
    const value = 1;
    if (value > 0) {
        console.log('positive');
    }
}

// ❌ WRONG - 2 spaces
function example() {
  const value = 1;
  if (value > 0) {
    console.log('positive');
  }
}

// ❌ WRONG - Tabs
function example() {
	const value = 1;
}
```

### Empty Lines

**One empty line after function definitions:**

```javascript
// ✅ CORRECT
function functionOne() {
    return 1;
}

function functionTwo() {
    return 2;
}

// ❌ WRONG - No space between functions
function functionOne() {
    return 1;
}
function functionTwo() {
    return 2;
}
```

**One empty line after receive() method definition:**

```javascript
// ✅ CORRECT
module.exports = {
    async receive(context) {
        const data = context.messages.in.content;
        return context.sendJson(data, 'out');
    }
};

// ❌ WRONG - No space after receive
module.exports = {
    async receive(context) {
        const data = context.messages.in.content;
        return context.sendJson(data, 'out');
    }
};
```

### Line Length

Aim for 100-120 characters per line. Break longer lines logically:

```javascript
// ✅ CORRECT - Split long lines
const response = await context.httpRequest({
    method: 'GET',
    url: 'https://api.service.com/v1/tasks',
    headers: {
        'Authorization': `Bearer ${context.auth.accessToken}`,
        'Content-Type': 'application/json'
    }
});

// ❌ AVOID - Overly long line
const response = await context.httpRequest({ method: 'GET', url: 'https://api.service.com/v1/tasks', headers: { 'Authorization': `Bearer ${context.auth.accessToken}`, 'Content-Type': 'application/json' } });
```

## Naming Conventions

### Variables and Functions: camelCase

```javascript
// ✅ CORRECT
const taskId = 123;
const taskList = [];
const getUserName = async () => {};
const calculateTotal = (items) => {};

// ❌ WRONG
const task_id = 123;
const TaskList = [];
const get_user_name = async () => {};
```

### Constants: UPPER_SNAKE_CASE

```javascript
// ✅ CORRECT
const MAX_RETRIES = 3;
const API_BASE_URL = 'https://api.service.com';
const DEFAULT_TIMEOUT = 5000;

// ❌ WRONG
const maxRetries = 3;  // Should be constant
const maxRetries = 3;  // Wrong case
```

### Exception: External API Fields

When working with external APIs, use the API's naming convention:

```javascript
// ✅ CORRECT - Matches external API
const task = {
    task_id: 123,      // API uses snake_case
    created_at: '2024-01-01',
    modified_at: '2024-01-02'
};

// Internal mapping
const localTask = {
    taskId: task.task_id,
    createdAt: task.created_at,
    modifiedAt: task.modified_at
};
```

### Classes and Constructors: PascalCase

```javascript
// ✅ CORRECT
class TaskManager {
    constructor(apiKey) {
        this.apiKey = apiKey;
    }
}

// ❌ WRONG
class taskManager {
    // ...
}
```

## Variable Declarations

### Use const and let, Never var

```javascript
// ✅ CORRECT
const immutable = 'value';
let mutable = 'value';
mutable = 'new value';

// ❌ WRONG
var oldStyle = 'value';
```

### Prefer const Over let

```javascript
// ✅ CORRECT - Use const by default
const { taskId } = context.messages.in.content;
const baseUrl = 'https://api.service.com';

let index = 0;  // Only use let if reassigned
index++;
```

## Comments

### Use // for Single Lines

```javascript
// ✅ CORRECT
// Get task data from input
const { taskId } = context.messages.in.content;

// ❌ WRONG
/* Get task data from input */
const { taskId } = context.messages.in.content;
```

### Use /* */ for Block Comments

```javascript
// ✅ CORRECT
/*
 * This section handles error cases
 * and attempts recovery
 */
try {
    // ...
} catch (error) {
    // ...
}
```

### Comment Complex Logic

```javascript
// ✅ GOOD - Explains the why
async receive(context) {
    const { taskId } = context.messages.in.content;

    // Fetch full task details because we need relationships
    // that aren't returned by search endpoint
    const response = await context.httpRequest({
        method: 'GET',
        url: `https://api.service.com/tasks/${taskId}/full`
    });

    return context.sendJson(response.data, 'out');
}
```

## Functions and Methods

### Use async/await, Not Promises

```javascript
// ✅ CORRECT
async receive(context) {
    const response = await context.httpRequest({ /* ... */ });
    return context.sendJson(response.data, 'out');
}

// ❌ AVOID
receive(context) {
    return context.httpRequest({ /* ... */ })
        .then(response => context.sendJson(response.data, 'out'));
}
```

### Arrow Functions for Callbacks

```javascript
// ✅ CORRECT
const items = tasks.map(task => ({
    id: task.id,
    name: task.title
}));

const filtered = items.filter(item => item.id > 100);

// ❌ AVOID - Anonymous function expressions
const items = tasks.map(function(task) {
    return { id: task.id, name: task.title };
});
```

### Named Functions for Named Exports

```javascript
// ✅ CORRECT
module.exports = {
    async receive(context) {
        // ...
    }
};

// ✅ ALSO CORRECT
async function receive(context) {
    // ...
}

module.exports = { receive };
```

## Error Handling

### Use Specific Error Types

```javascript
// ✅ CORRECT
if (!taskId) {
    throw new context.CancelError('Task ID is required!');
}

if (error.status === 404) {
    throw new context.CancelError(`Task ${taskId} not found`);
}

if (error.status === 500) {
    throw error;  // Re-throw server errors
}

// ❌ AVOID - Generic errors
throw new Error('Something went wrong');
```

### Use Message Templates for Clarity

```javascript
// ✅ CORRECT - Clear, specific error messages
throw new context.CancelError('Task ID is required!');
throw new context.CancelError(`Task ${taskId} not found`);
throw new context.CancelError('You do not have permission to access this task');

// ❌ AVOID - Vague messages
throw new context.CancelError('Invalid input');
throw new context.CancelError('Error');
```

## Object and Array Formatting

### Multi-line Objects

```javascript
// ✅ CORRECT
const payload = {
    title: 'Task Title',
    description: 'Task description',
    priority: 'high',
    dueDate: '2024-12-31'
};

// ✅ ALSO CORRECT - Single property
const payload = { title: 'Task Title' };

// ❌ AVOID - Inconsistent mixing
const payload = { title: 'Task Title',
    description: 'Task description',
priority: 'high' };
```

### Array Formatting

```javascript
// ✅ CORRECT - Short arrays on one line
const statuses = ['open', 'in_progress', 'completed'];

// ✅ CORRECT - Long arrays on multiple lines
const options = [
    { label: 'Open', value: 'open' },
    { label: 'In Progress', value: 'in_progress' },
    { label: 'Completed', value: 'completed' },
    { label: 'Archived', value: 'archived' }
];

// ✅ CORRECT - Trailing comma on multi-line
const items = [
    item1,
    item2,
    item3,
];
```

## String Formatting

### Use Template Literals

```javascript
// ✅ CORRECT
const message = `Task ${taskId} created successfully`;
const url = `https://api.service.com/tasks/${taskId}`;

// ❌ AVOID - String concatenation
const message = 'Task ' + taskId + ' created successfully';
const url = 'https://api.service.com/tasks/' + taskId;
```

### Use Single or Double Quotes Consistently

Choose one and stick to it. Template literals are preferred over quotes:

```javascript
// ✅ PREFERRED - Template literals
const name = `Task Name`;
const message = `Created at ${date}`;

// ✅ ACCEPTABLE - Single quotes
const name = 'Task Name';
const url = 'https://api.service.com';

// ❌ AVOID - Mixing
const mixed = 'double and "single"';
```

## Conditional Statements

### Keep Conditions Simple

```javascript
// ✅ CORRECT
if (!taskId) {
    throw new context.CancelError('Task ID is required!');
}

// ✅ CORRECT
if (priority === 'high' || priority === 'urgent') {
    return context.sendJson(task, 'urgent');
}

// ❌ AVOID - Complex nested conditions
if (taskId) {
    if (priority) {
        if (status) {
            // ...
        }
    }
}
```

### Use Early Returns

```javascript
// ✅ CORRECT - Early return reduces nesting
async receive(context) {
    const { taskId } = context.messages.in.content;

    if (!taskId) {
        throw new context.CancelError('Task ID is required!');
    }

    const response = await context.httpRequest({ /* ... */ });
    return context.sendJson(response.data, 'out');
}

// ❌ AVOID - Excessive nesting
async receive(context) {
    const { taskId } = context.messages.in.content;

    if (taskId) {
        const response = await context.httpRequest({ /* ... */ });
        if (response.ok) {
            return context.sendJson(response.data, 'out');
        }
    }
}
```

## Module Exports

### Clear and Organized

```javascript
// ✅ CORRECT
module.exports = {
    async receive(context) {
        // Implementation
    },

    async tick(context) {
        // Implementation
    }
};

// ✅ ALSO CORRECT - For single export
module.exports = {
    type: 'apiKey',
    definition: {
        // ...
    }
};
```

## Related Documentation

- **[Development Guidelines](development-guidelines.md)** - Component requirements
- **[Performance Considerations](performance.md)** - Optimization best practices
- **[Common Patterns](common-patterns.md)** - Reusable implementation patterns
