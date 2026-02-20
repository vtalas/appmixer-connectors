// Auto-generated schema. Do not edit.

const inputSchema = {
    type: "object",
    properties: {
        selected_ids: {
            type: "array",
            description: "Array of deal IDs to delete",
            items: {
                type: "integer",
                description: "Deal ID"
            }
        }
    },
    required: [
        "selected_ids"
    ]
};

const outputSchema = {};

module.exports = { inputSchema, outputSchema };
