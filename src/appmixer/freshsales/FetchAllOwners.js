// Auto-generated schema. Do not edit.

const inputSchema = {
    type: "object",
    properties: {}
};

const outputSchema = {
    type: "object",
    properties: {
        users: {
            type: "array",
            description: "List of users/owners",
            items: {
                type: "object",
                properties: {
                    id: {
                        type: "integer",
                        description: "Unique ID of the user"
                    },
                    name: {
                        type: "string",
                        description: "Name of the user"
                    }
                }
            }
        }
    }
};

module.exports = { inputSchema, outputSchema };
