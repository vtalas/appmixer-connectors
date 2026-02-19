// Auto-generated schema. Do not edit.

const inputSchema = {
    type: "object",
    properties: {}
};

const outputSchema = {
    type: "object",
    properties: {
        campaigns: {
            type: "array",
            description: "List of campaigns",
            items: {
                type: "object",
                properties: {
                    id: {
                        type: "integer",
                        description: "Unique ID of the campaign"
                    },
                    name: {
                        type: "string",
                        description: "Name of the campaign"
                    }
                }
            }
        }
    }
};

module.exports = { inputSchema, outputSchema };
