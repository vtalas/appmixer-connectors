// Auto-generated schema. Do not edit.

const inputSchema = {
    type: "object",
    properties: {}
};

const outputSchema = {
    type: "object",
    properties: {
        currencies: {
            type: "array",
            description: "List of currencies",
            items: {
                type: "object",
                properties: {
                    id: {
                        type: "integer",
                        description: "Unique ID of the currency"
                    },
                    currency_code: {
                        type: "string",
                        description: "Currency code (e.g. USD, EUR)"
                    },
                    name: {
                        type: "string",
                        description: "Name of the currency"
                    }
                }
            }
        }
    }
};

module.exports = { inputSchema, outputSchema };
