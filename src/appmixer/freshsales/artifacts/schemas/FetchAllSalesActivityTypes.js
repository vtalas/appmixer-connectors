// Auto-generated schema. Do not edit.

const inputSchema = {
    type: "object",
    properties: {}
};

const outputSchema = {
    type: "object",
    properties: {
        sales_activity_types: {
            type: "array",
            description: "List of sales activity types",
            items: {
                type: "object",
                properties: {
                    id: {
                        type: "integer",
                        description: "Unique ID of the sales activity type"
                    },
                    name: {
                        type: "string",
                        description: "Name of the sales activity type"
                    }
                }
            }
        }
    }
};

module.exports = { inputSchema, outputSchema };
