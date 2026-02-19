// Auto-generated schema. Do not edit.

const inputSchema = {
    type: "object",
    properties: {}
};

const outputSchema = {
    type: "object",
    properties: {
        industry_types: {
            type: "array",
            description: "List of industry types",
            items: {
                type: "object",
                properties: {
                    id: {
                        type: "integer",
                        description: "Unique ID of the industry type"
                    },
                    name: {
                        type: "string",
                        description: "Name of the industry type"
                    }
                }
            }
        }
    }
};

module.exports = { inputSchema, outputSchema };
