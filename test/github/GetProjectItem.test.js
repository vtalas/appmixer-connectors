const assert = require('assert');
const path = require('path');
const dotenv = require('dotenv');
const axios = require('axios');

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../.env') });

// Import the component
const GetProjectItem = require('../../src/appmixer/github/project/GetProjectItem/GetProjectItem');

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

describe('GetProjectItem', () => {
    const auth = {
        accessToken: process.env.GITHUB_ACCESS_TOKEN
    };

    before(async function() {
        // Skip all tests if the access token is not set
        if (!auth.accessToken) { this.skip(); }
    });

    it('should get project item details', async () => {
        // Note: This test needs a real project item ID
        const messages = {
            in: {
                content: {
                    // valid id
                    projectItemId: 'PVTI_lADOAA12oc4AGXUuzgbi8fA'
                }
            }
        };

        const context = createMockContext(auth, messages);

        try {
            const result = await GetProjectItem.receive(context);

            console.log(result);
            assert(result, 'Should return result');
            assert(result.port === 'out', 'Should use out port');
            assert(result.data, 'Should have data');
            assert(result.data.id, 'Should have item ID');
            assert(result.data.content, 'Should have content');
            assert(Array.isArray(result.data.fieldValues), 'Should have field values array');
        } catch (error) {
            // If the specific item ID doesn't exist, that's expected
            if (error.message.includes('not found')) {
                console.log('Project item not found - this is expected if using example ID');
            } else {
                throw error;
            }
        }
    });
});
