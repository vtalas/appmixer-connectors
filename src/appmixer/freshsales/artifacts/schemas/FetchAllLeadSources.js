// Auto-generated schema. Do not edit.

const inputSchema = {
    type: "object",
    properties: {}
};

const outputSchema = {
    type: "object",
    properties: {
        lead_sources: {
            type: "array",
            description: "List of lead sources",
            items: {
                type: "object",
                properties: {
                    id: {
                        type: "integer",
                        description: "Unique ID of the lead source"
                    },
                    name: {
                        type: "string",
                        description: "Name of the lead source"
                    }
                }
            }
        }
    }
};

module.exports = { inputSchema, outputSchema };
