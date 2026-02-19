// Auto-generated schema. Do not edit.

const inputSchema = {
    type: "object",
    properties: {}
};

const outputSchema = {
    type: "object",
    properties: {
        contact_statuses: {
            type: "array",
            description: "List of contact statuses",
            items: {
                type: "object",
                properties: {
                    id: {
                        type: "integer",
                        description: "Unique ID of the contact status"
                    },
                    name: {
                        type: "string",
                        description: "Name of the contact status"
                    }
                }
            }
        }
    }
};

module.exports = { inputSchema, outputSchema };
