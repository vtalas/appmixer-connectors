// Auto-generated schema. Do not edit.

const inputSchema = {
    type: "object",
    properties: {
        unique_identifier: {
            type: "object",
            description: "Object containing the unique identifier field and value to match for upsert",
            properties: {
                name: {
                    type: "string",
                    description: "The name of the deal used as the unique identifier"
                }
            }
        },
        deal: {
            type: "object",
            description: "Deal properties to create or update",
            properties: {
                amount: {
                    type: "string",
                    description: "The monetary value of the deal"
                }
            }
        }
    },
    required: [
        "unique_identifier",
        "deal"
    ]
};

const outputSchema = {
    type: "object",
    properties: {
        deal: {
            type: "object",
            description: "The upserted deal object",
            properties: {
                id: {
                    type: "integer",
                    description: "Unique identifier of the deal"
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
                    description: "Custom fields associated with the deal",
                    properties: {
                        cf_number_of_agents: {
                            type: "integer",
                            description: "Custom field for number of agents"
                        }
                    }
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
                updater_id: {
                    type: "integer",
                    description: "ID of the user who last updated the deal",
                    format: "int64"
                }
            }
        }
    }
};

module.exports = { inputSchema, outputSchema };
