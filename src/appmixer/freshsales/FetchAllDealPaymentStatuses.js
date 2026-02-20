// Auto-generated schema. Do not edit.

const inputSchema = {
    type: "object",
    properties: {}
};

const outputSchema = {
    type: "object",
    properties: {
        deal_payment_statuses: {
            type: "array",
            description: "List of deal payment statuses",
            items: {
                type: "object",
                properties: {
                    id: {
                        type: "integer",
                        description: "Unique ID of the deal payment status"
                    },
                    name: {
                        type: "string",
                        description: "Name of the deal payment status"
                    }
                }
            }
        }
    }
};

module.exports = { inputSchema, outputSchema };
