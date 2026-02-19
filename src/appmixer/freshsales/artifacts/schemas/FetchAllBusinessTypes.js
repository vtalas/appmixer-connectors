// Auto-generated schema. Do not edit.

const inputSchema = {
    type: "object",
    properties: {}
};

const outputSchema = {
    type: "object",
    properties: {
        business_types: {
            type: "array",
            description: "List of business types",
            items: {
                type: "object",
                properties: {
                    id: {
                        type: "integer",
                        description: "Unique ID of the business type"
                    },
                    name: {
                        type: "string",
                        description: "Name of the business type"
                    }
                }
            }
        }
    }
};

module.exports = { inputSchema, outputSchema };
