# Part 5: Best Practices - Testing

## Overview

Unit tests ensure connector reliability and catch regressions. Appmixer uses Mocha for test frameworks and Node.js assert for assertions.

## Test Structure

### Directory Organization

```
test/
├── utils.js                # Appmixer test utilities
├── <connector_name>/
│   ├── FindTasks.js
│   ├── GetTask.js
│   ├── CreateTask.js
│   ├── UpdateTask.js
│   ├── DeleteTask.js
│   ├── auth.js
│   └── quota.js
```

### Running Tests

Run tests for specific connector:

```bash
npm run test-unit -- test/<connector_name>
```

Run all tests:

```bash
npm run test-unit
```

## Basic Test Template

```javascript
'use strict';

const assert = require('assert');
const { TestContext, readYamlFile } = require('../utils');

describe('MyConnector - GetTask Component', () => {
    let context;

    beforeEach(() => {
        context = new TestContext();
        // Setup mock data or configuration
    });

    it('should retrieve a task by ID', async () => {
        // Arrange
        const input = { taskId: '123' };

        // Act
        const result = await context.receive(input);

        // Assert
        assert.strictEqual(result.taskId, '123');
        assert.ok(result.title);
    });

    it('should throw error when taskId is missing', async () => {
        // Arrange
        const input = {};

        // Act & Assert
        assert.rejects(
            () => context.receive(input),
            /Task ID is required/
        );
    });
});
```

## Test Utilities

### TestContext

The `TestContext` from `test/utils.js` provides:

```javascript
const { TestContext } = require('../utils');

const context = new TestContext();

// Mock HTTP requests
context.httpRequest = async (config) => {
    return { data: { /* mocked response */ } };
};

// Call component behavior
const result = await componentModule.receive(context);

// Access component state
context.state = { /* mutable state */ };

// Access properties
context.properties = { /* component properties */ };

// Setup auth
context.auth = {
    accessToken: 'test-token',
    apiKey: 'test-key'
};
```

### Reading Test Data

```javascript
const { readYamlFile } = require('../utils');

const testData = readYamlFile('./test-data.yaml');
```

## Common Test Patterns

### Testing Successful Operations

```javascript
it('should create a task successfully', async () => {
    // Setup
    context.httpRequest = async (config) => {
        assert.strictEqual(config.method, 'POST');
        return {
            data: {
                id: '456',
                title: 'Test Task',
                status: 'open'
            }
        };
    };

    // Execute
    const result = await componentModule.receive(context);

    // Verify
    assert.strictEqual(result.id, '456');
    assert.strictEqual(result.title, 'Test Task');
});
```

### Testing Error Conditions

```javascript
it('should throw error on invalid input', async () => {
    // Setup
    const input = { /* missing required fields */ };
    context.messages = { in: { content: input } };

    // Verify error
    await assert.rejects(
        () => componentModule.receive(context),
        /required/i
    );
});
```

### Testing API Failures

```javascript
it('should handle 404 errors', async () => {
    // Setup
    context.httpRequest = async (config) => {
        const error = new Error('Not found');
        error.status = 404;
        throw error;
    };

    // Verify
    await assert.rejects(
        () => componentModule.receive(context),
        /not found/i
    );
});
```

### Testing Data Transformation

```javascript
it('should transform API response to component output', async () => {
    // Setup
    context.httpRequest = async (config) => {
        return {
            data: {
                task_id: '123',
                task_name: 'Fix bug',
                task_status: 'open'
            }
        };
    };

    // Execute
    const result = await componentModule.receive(context);

    // Verify transformation
    assert.strictEqual(result.id, '123');
    assert.strictEqual(result.title, 'Fix bug');
    assert.strictEqual(result.status, 'open');
});
```

## Testing Authentication

### API Key Authentication

```javascript
const auth = require('../src/appmixer/service/auth');

describe('MyService - Authentication', () => {
    it('should validate correct credentials', async () => {
        const context = {
            apiKey: 'valid-key',
            domain: 'example',
            httpRequest: async (config) => {
                // Mock successful API response
                return { data: { id: 'user-123' } };
            }
        };

        // Should not throw
        const result = await auth.definition.validate(context);
        assert.ok(result);
    });

    it('should reject invalid credentials', async () => {
        const context = {
            apiKey: 'invalid-key',
            domain: 'example',
            httpRequest: async (config) => {
                const error = new Error('Unauthorized');
                error.status = 401;
                throw error;
            }
        };

        // Should throw
        await assert.rejects(
            () => auth.definition.validate(context)
        );
    });
});
```

### OAuth2 Authentication

```javascript
const auth = require('../src/appmixer/service/auth');

describe('MyService - OAuth2', () => {
    it('should exchange authorization code for token', async () => {
        const context = {
            authorizationCode: 'auth-code-123',
            clientId: 'test-client',
            clientSecret: 'test-secret',
            callbackUrl: 'https://callback.example.com',
            httpRequest: async (config) => {
                assert.strictEqual(config.method, 'POST');
                return {
                    data: {
                        access_token: 'new-token',
                        expires_in: 3600,
                        refresh_token: 'new-refresh'
                    }
                };
            }
        };

        const result = await auth.definition.requestAccessToken(context);

        assert.strictEqual(result.accessToken, 'new-token');
        assert.strictEqual(result.refreshToken, 'new-refresh');
    });
});
```

## Testing Components by Type

### Testing Find Component

```javascript
describe('FindTasks Component', () => {
    it('should find tasks by query', async () => {
        context.messages = {
            in: { content: { query: 'bug', outputType: 'array' } }
        };

        context.httpRequest = async (config) => {
            assert.ok(config.params.q.includes('bug'));
            return {
                data: {
                    items: [
                        { id: '1', title: 'Fix bug #1' },
                        { id: '2', title: 'Fix bug #2' }
                    ]
                }
            };
        };

        const result = await findTasks.receive(context);

        assert.strictEqual(result.result.length, 2);
        assert.strictEqual(result.count, 2);
    });

    it('should return empty when no matches', async () => {
        context.messages = { in: { content: { query: 'xyz' } } };
        context.httpRequest = async () => ({ data: { items: [] } });

        const result = await findTasks.receive(context);

        assert.strictEqual(result, {});  // notFound port
    });
});
```

### Testing Trigger Component

```javascript
describe('NewTask Trigger', () => {
    it('should send new tasks on tick', async () => {
        // Setup state from previous run
        context.state = { lastSeenId: 100 };

        let requestParams;
        context.httpRequest = async (config) => {
            requestParams = config.params;
            return {
                data: {
                    items: [
                        { id: 101, title: 'New Task 1' },
                        { id: 102, title: 'New Task 2' }
                    ]
                }
            };
        };

        const results = [];
        context.sendJson = async (data, port) => {
            results.push(data);
        };

        // Execute tick
        await trigger.tick(context);

        // Verify
        assert.strictEqual(requestParams.since, 100);
        assert.strictEqual(results.length, 2);
        assert.strictEqual(context.state.lastSeenId, 102);
    });
});
```

### Testing Delete Component

```javascript
describe('DeleteTask Component', () => {
    it('should delete task and return empty object', async () => {
        context.messages = { in: { content: { taskId: '123' } } };

        let deleteUrl;
        context.httpRequest = async (config) => {
            deleteUrl = config.url;
            assert.strictEqual(config.method, 'DELETE');
        };

        const result = await deleteTask.receive(context);

        assert.ok(deleteUrl.includes('123'));
        assert.deepStrictEqual(result, {});
    });

    it('should throw on missing task ID', async () => {
        context.messages = { in: { content: {} } };

        await assert.rejects(
            () => deleteTask.receive(context),
            /Task ID is required/
        );
    });
});
```

## Mocking External Services

### Simple Mock

```javascript
it('should work with mocked service', async () => {
    context.httpRequest = async (config) => {
        if (config.url.includes('/tasks')) {
            return {
                data: {
                    items: [
                        { id: '1', title: 'Task 1' }
                    ]
                }
            };
        }
    };

    const result = await findTasks.receive(context);
    assert.ok(result.result);
});
```

### Advanced Mock with Verification

```javascript
it('should make correct API calls', async () => {
    const calls = [];
    context.httpRequest = async (config) => {
        calls.push({
            method: config.method,
            url: config.url,
            params: config.params
        });

        return { data: { items: [] } };
    };

    await findTasks.receive(context);

    assert.strictEqual(calls.length, 1);
    assert.strictEqual(calls[0].method, 'GET');
    assert.ok(calls[0].url.includes('api.service.com'));
});
```

## Code Coverage

Check test coverage:

```bash
npm run test-unit -- --coverage
```

Aim for:
- **90%+** line coverage
- **80%+** branch coverage
- **100%** critical paths (auth, delete, create)

## Testing Best Practices

1. **Test happy path**: Successful operation with valid data
2. **Test error cases**: Missing inputs, API errors, timeouts
3. **Test edge cases**: Empty results, null values, special characters
4. **Mock external APIs**: Never call real services in tests
5. **Test data transformation**: Verify input/output mapping
6. **Test authentication**: Verify credential validation
7. **Use clear names**: Describe what the test verifies
8. **Keep tests focused**: One assertion per concept
9. **Use beforeEach**: Setup common context
10. **Document non-obvious tests**: Comment complex scenarios

## Example Test File

```javascript
'use strict';

const assert = require('assert');
const { TestContext } = require('../utils');

const componentModule = require('../../src/appmixer/service/core/GetTask/GetTask');

describe('Service - GetTask', () => {
    let context;

    beforeEach(() => {
        context = new TestContext();
        context.auth = { accessToken: 'test-token' };
    });

    describe('when task exists', () => {
        it('should return task by ID', async () => {
            context.messages = {
                in: { content: { taskId: '123' } }
            };

            context.httpRequest = async (config) => {
                return {
                    data: {
                        id: '123',
                        title: 'Test Task',
                        status: 'open',
                        created_at: '2024-01-01'
                    }
                };
            };

            const result = await componentModule.receive(context);

            assert.strictEqual(result.id, '123');
            assert.strictEqual(result.title, 'Test Task');
        });
    });

    describe('when task not found', () => {
        it('should throw 404 error', async () => {
            context.messages = {
                in: { content: { taskId: '999' } }
            };

            context.httpRequest = async () => {
                const error = new Error('Not found');
                error.status = 404;
                throw error;
            };

            await assert.rejects(
                () => componentModule.receive(context),
                /not found/i
            );
        });
    });

    describe('validation', () => {
        it('should require task ID', async () => {
            context.messages = { in: { content: {} } };

            await assert.rejects(
                () => componentModule.receive(context),
                /Task ID is required/
            );
        });
    });
});
```

## Related Documentation

- **[Development Guidelines](development-guidelines.md)** - Component requirements
- **[Code Style](code-style.md)** - Test code formatting
- **[Common Patterns](common-patterns.md)** - Reusable test patterns
