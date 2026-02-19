// Auto-generated schema. Do not edit.

const inputSchema = {
    type: "object",
    properties: {}
};

const outputSchema = {
    type: "object",
    properties: {
        sales_activity_outcomes: {
            type: "array",
            description: "List of sales activity outcomes",
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
                    }
                }
            }
        }
    }
};

module.exports = { inputSchema, outputSchema };
