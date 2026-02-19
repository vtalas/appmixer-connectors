// Auto-generated schema. Do not edit.

const inputSchema = {
    type: "object",
    properties: {}
};

const outputSchema = {
    type: "object",
    properties: {
        sales_activity_entity_types: {
            type: "array",
            description: "List of sales activity entity types",
            items: {
                type: "object",
                properties: {
                    id: {
                        type: "integer",
                        description: "Unique ID of the sales activity entity type"
                    },
                    name: {
                        type: "string",
                        description: "Name of the sales activity entity type"
                    }
                }
            }
        }
    }
};

module.exports = { inputSchema, outputSchema };
