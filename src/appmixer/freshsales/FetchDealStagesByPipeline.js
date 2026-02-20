// Auto-generated schema. Do not edit.

const inputSchema = {
    type: "object",
    properties: {
        id: {
            type: "integer",
            description: "ID of the deal pipeline"
        }
    },
    required: [
        "id"
    ]
};

const outputSchema = {
    type: "object",
    properties: {
        deal_stages: {
            type: "array",
            description: "List of deal stages for the specified pipeline",
            items: {
                type: "object",
                properties: {
                    id: {
                        type: "integer",
                        description: "Unique ID of the deal stage"
                    },
                    name: {
                        type: "string",
                        description: "Name of the deal stage"
                    },
                    deal_pipeline_id: {
                        type: "integer",
                        description: "ID of the deal pipeline this stage belongs to"
                    }
                }
            }
        }
    }
};

module.exports = { inputSchema, outputSchema };
