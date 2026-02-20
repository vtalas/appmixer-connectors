// Auto-generated schema. Do not edit.

const inputSchema = {
    type: "object",
    properties: {}
};

const outputSchema = {
    type: "object",
    properties: {
        designations: {
            type: "array",
            description: "List of designations",
            items: {
                type: "object",
                properties: {
                    id: {
                        type: "integer",
                        description: "Unique ID of the designation"
                    },
                    name: {
                        type: "string",
                        description: "Name of the designation"
                    }
                }
            }
        }
    }
};

module.exports = { inputSchema, outputSchema };
