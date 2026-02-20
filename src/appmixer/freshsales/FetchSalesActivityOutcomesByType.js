// Auto-generated schema. Do not edit.

const inputSchema = {
    type: "object",
    properties: {
        id: {
            type: "integer",
            description: "ID of the sales activity type"
        }
    },
    required: [
        "id"
    ]
};

const outputSchema = {
    type: "object",
    properties: {
        sales_activity_outcomes: {
            type: "array",
            description: "List of sales activity outcomes for the specified type",
            items: {
                type: "object",
                properties: {
                    id: {
                        type: "integer",
                        description: "Unique ID of the sales activity outcome"
                    },
                    name: {
                        type: "string",
                        description: "Name of the sales activity outcome"
                    },
                    sales_activity_type_id: {
                        type: "integer",
                        description: "ID of the parent sales activity type"
                    }
                }
            }
        }
    }
};

module.exports = { inputSchema, outputSchema };
