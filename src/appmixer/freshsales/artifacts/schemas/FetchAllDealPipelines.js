// Auto-generated schema. Do not edit.

const inputSchema = {
    type: "object",
    properties: {}
};

const outputSchema = {
    type: "object",
    properties: {
        deal_pipelines: {
            type: "array",
            description: "List of deal pipelines",
            items: {
                type: "object",
                properties: {
                    id: {
                        type: "integer",
                        description: "Unique ID of the deal pipeline"
                    },
                    name: {
                        type: "string",
                        description: "Name of the deal pipeline"
                    }
                }
            }
        }
    }
};

module.exports = { inputSchema, outputSchema };
