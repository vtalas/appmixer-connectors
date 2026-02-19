// Auto-generated schema. Do not edit.

const inputSchema = {
    type: "object",
    properties: {
        id: {
            type: "integer",
            description: "The ID of the deal to delete"
        }
    },
    required: [
        "id"
    ]
};

const outputSchema = {
    type: "boolean",
    description: "Returns true on successful deletion"
};

module.exports = { inputSchema, outputSchema };
