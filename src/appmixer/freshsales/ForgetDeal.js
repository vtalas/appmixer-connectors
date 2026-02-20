// Auto-generated schema. Do not edit.

const inputSchema = {
    type: "object",
    properties: {
        id: {
            type: "integer",
            description: "The ID of the deal to permanently hard delete"
        }
    },
    required: [
        "id"
    ]
};

const outputSchema = {
    type: "boolean",
    description: "Returns true on successful hard deletion"
};

module.exports = { inputSchema, outputSchema };
