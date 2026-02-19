// Auto-generated schema. Do not edit.

const inputSchema = {
    type: "object",
    properties: {}
};

const outputSchema = {
    type: "object",
    properties: {
        deal_products: {
            type: "array",
            description: "List of deal products",
            items: {
                type: "object",
                properties: {
                    id: {
                        type: "integer",
                        description: "Unique ID of the deal product"
                    },
                    name: {
                        type: "string",
                        description: "Name of the deal product"
                    }
                }
            }
        }
    }
};

module.exports = { inputSchema, outputSchema };
