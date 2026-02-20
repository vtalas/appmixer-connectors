// Auto-generated schema. Do not edit.

const inputSchema = {
    type: "object",
    properties: {}
};

const outputSchema = {
    type: "object",
    properties: {
        deal_reasons: {
            type: "array",
            description: "List of deal reasons",
            items: {
                type: "object",
                properties: {
                    id: {
                        type: "integer",
                        description: "Unique ID of the deal reason"
                    },
                    name: {
                        type: "string",
                        description: "Name of the deal reason"
                    }
                }
            }
        }
    }
};

module.exports = { inputSchema, outputSchema };
