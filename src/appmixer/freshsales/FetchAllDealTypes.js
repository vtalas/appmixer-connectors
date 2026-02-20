// Auto-generated schema. Do not edit.

const inputSchema = {
    type: "object",
    properties: {}
};

const outputSchema = {
    type: "object",
    properties: {
        deal_types: {
            type: "array",
            description: "List of deal types",
            items: {
                type: "object",
                properties: {
                    id: {
                        type: "integer",
                        description: "Unique ID of the deal type"
                    },
                    name: {
                        type: "string",
                        description: "Name of the deal type"
                    }
                }
            }
        }
    }
};

module.exports = { inputSchema, outputSchema };
