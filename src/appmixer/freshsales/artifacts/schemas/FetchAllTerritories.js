// Auto-generated schema. Do not edit.

const inputSchema = {
    type: "object",
    properties: {}
};

const outputSchema = {
    type: "object",
    properties: {
        territories: {
            type: "array",
            description: "List of territories",
            items: {
                type: "object",
                properties: {
                    id: {
                        type: "integer",
                        description: "Unique ID of the territory"
                    },
                    name: {
                        type: "string",
                        description: "Name of the territory"
                    }
                }
            }
        }
    }
};

module.exports = { inputSchema, outputSchema };
