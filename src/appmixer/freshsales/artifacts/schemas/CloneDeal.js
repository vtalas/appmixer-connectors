// Auto-generated schema. Do not edit.

const inputSchema = {
    type: "object",
    properties: {
        id: {
            type: "integer",
            description: "The ID of the deal to clone"
        },
        deal: {
            type: "object",
            description: "Optional deal properties to override in the cloned deal",
            properties: {
                name: {
                    type: "string",
                    description: "Name of the cloned deal"
                },
                amount: {
                    type: "number",
                    description: "The monetary value of the deal"
                },
                sales_account_id: {
                    type: "integer",
                    description: "ID of the sales account to associate with the deal"
                }
            }
        }
    },
    required: [
        "id"
    ]
};

const outputSchema = {
    type: "object",
    properties: {
        users: {
            type: "array",
            description: "Array of users associated with the cloned deal",
            items: {
                type: "object",
                properties: {
                    id: {
                        type: "integer",
                        description: "Unique identifier of the user"
                    },
                    display_name: {
                        type: "string",
                        description: "Display name of the user"
                    },
                    email: {
                        type: "string",
                        description: "Email address of the user",
                        format: "email"
                    }
                }
            }
        },
        deal: {
            type: "object",
            description: "The cloned deal object",
            properties: {
                id: {
                    type: "integer",
                    description: "Unique identifier of the cloned deal"
                },
                name: {
                    type: "string",
                    description: "Name of the deal"
                },
                amount: {
                    type: "string",
                    description: "The monetary value of the deal"
                },
                base_currency_amount: {
                    type: "string",
                    description: "The deal amount in the base currency"
                },
                expected_close: {
                    type: "string",
                    description: "Expected close date of the deal",
                    format: "date"
                },
                closed_date: {
                    type: "string",
                    description: "Actual closed date of the deal",
                    format: "date"
                },
                stage_updated_time: {
                    type: "string",
                    description: "Timestamp when the deal stage was last updated",
                    format: "date-time"
                },
                custom_field: {
                    type: "object",
                    description: "Custom fields associated with the deal"
                },
                probability: {
                    type: "integer",
                    description: "Probability of winning the deal (percentage)"
                },
                updated_at: {
                    type: "string",
                    description: "Timestamp when the deal was last updated",
                    format: "date-time"
                },
                created_at: {
                    type: "string",
                    description: "Timestamp when the deal was created",
                    format: "date-time"
                },
                age: {
                    type: "integer",
                    description: "Age of the deal in days"
                },
                creater_id: {
                    type: "integer",
                    description: "ID of the user who created the deal"
                }
            }
        }
    }
};

module.exports = { inputSchema, outputSchema };
