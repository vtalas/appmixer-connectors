// Auto-generated schema. Do not edit.

const inputSchema = {
    type: "object",
    properties: {
        id: {
            type: "integer",
            description: "The ID of the deal to update"
        },
        deal: {
            type: "object",
            description: "Deal property data object with fields to update",
            properties: {
                probability: {
                    type: "integer",
                    description: "Probability of closing the deal (percentage)"
                },
                custom_field: {
                    type: "object",
                    description: "Custom fields to update",
                    properties: {
                        cf_number_of_agents: {
                            type: "integer",
                            description: "Custom field for number of agents"
                        }
                    }
                },
                contacts_removed_list: {
                    type: "array",
                    description: "List of contact IDs to remove from the deal",
                    items: {
                        type: "integer"
                    }
                }
            }
        }
    },
    required: [
        "id",
        "deal"
    ]
};

const outputSchema = {
    type: "object",
    properties: {
        users: {
            type: "array",
            description: "List of users associated with the deal",
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
            description: "The updated deal object",
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
                    description: "Deal amount as a string"
                },
                base_currency_amount: {
                    type: "string",
                    description: "Deal amount in base currency as a string"
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
                    description: "Probability of closing the deal (percentage)"
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
                    description: "ID of the user who last updated the deal"
                }
            }
        }
    }
};

module.exports = { inputSchema, outputSchema };
