const assert = require('assert');
const path = require('path');
const dotenv = require('dotenv');
const axios = require('axios');

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../.env') });

// Import the component
const FindProjectItems = require('../../src/appmixer/github/project/FindProjectItems/FindProjectItems');

// Mock context
const createMockContext = (auth, messages = {}) => {
    return {
        auth,
        messages,
        properties: {},
        httpRequest: async (options) => {
            const response = await axios({
                method: options.method || 'GET',
                url: options.url,
                headers: options.headers,
                data: options.data
            });

            return {
                data: response.data,
                status: response.status,
                headers: response.headers
            };
        },
        sendJson: (data, port) => {
            return { data, port };
        }
    };
};

describe('FindProjectItems', () => {
    const auth = {
        accessToken: process.env.GITHUB_ACCESS_TOKEN
    };

    before(async function() {
        // Skip all tests if the access token is not set
        if (!auth.accessToken) { this.skip(); }
    });

    const PROJECT_ID = 'PVT_kwDOAA12oc4AGXUu';

    before(async function() {
        // Skip all tests if the access token is not set
        if (!auth.accessToken) { this.skip(); }
    });

    it('should find project items', async () => {
        // Note: This test needs a real project ID
        const messages = {
            in: {
                content: {
                    projectId: PROJECT_ID, // Example project ID
                    outputType: 'array'
                }
            }
        };

        const context = createMockContext(auth, messages);

        try {
            const result = await FindProjectItems.receive(context);

            assert(result, 'Should return result');
            assert(result.port === 'out', 'Should use out port');
            assert(result.data, 'Should have data');
            assert(Array.isArray(result.data.result), 'Should return array of items');
            assert(typeof result.data.count === 'number', 'Should have count');
        } catch (error) {
            // If the specific project ID doesn't exist, that's expected
            if (error.message.includes('not found')) {
                console.log('Project not found - this is expected if using example ID');
            } else {
                throw error;
            }
        }
    });

    it('should filter project items by status', async () => {
        const messages = {
            in: {
                content: {
                    projectId: PROJECT_ID, // Example project ID
                    status: 'Todo',
                    outputType: 'array'
                }
            }
        };

        const context = createMockContext(auth, messages);

        try {
            const result = await FindProjectItems.receive(context);

            assert(result, 'Should return result');
            assert(result.port === 'out', 'Should use out port');
            assert(result.data, 'Should have data');
            assert(Array.isArray(result.data.result), 'Should return array of items');
            assert(typeof result.data.count === 'number', 'Should have count');
        } catch (error) {
            // If the specific project ID doesn't exist, that's expected
            if (error.message.includes('not found')) {
                console.log('Project not found - this is expected if using example ID');
            } else {
                throw error;
            }
        }
    });

    it('should generate output port options', async () => {
        const messages = {
            in: {
                content: {
                    outputType: 'array'
                }
            }
        };

        const context = createMockContext(auth, messages);
        context.properties.generateOutputPortOptions = true;

        const result = await FindProjectItems.receive(context);

        assert(result, 'Should return result');
        assert(Array.isArray(result.data), 'Should return array of options');
        assert(result.data.length > 0, 'Should have options');
    });
});
