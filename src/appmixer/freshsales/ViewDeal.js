// Auto-generated schema. Do not edit.

const inputSchema = {
    type: "object",
    properties: {
        id: {
            type: "integer",
            description: "Unique ID of the deal to retrieve"
        },
        include: {
            type: "string",
            description: "Use 'include' to embed additional details in the response. Possible values: sales_activities, owner, creater, updater, source, contacts, sales_account, deal_stage, deal_type, deal_reason, campaign, deal_payment_status, deal_product, currency.",
            enum: [
                "sales_activities",
                "owner",
                "creater",
                "updater",
                "source",
                "contacts",
                "sales_account",
                "deal_stage",
                "deal_type",
                "deal_reason",
                "campaign",
                "deal_payment_status",
                "deal_product",
                "currency"
            ]
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
            description: "List of users referenced in the deal",
            items: {
                type: "object",
                properties: {
                    id: {
                        type: "integer",
                        description: "Unique ID of the user"
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
            description: "The deal object",
            properties: {
                id: {
                    type: "integer",
                    description: "Unique ID of the deal"
                },
                name: {
                    type: "string",
                    description: "Name of the deal"
                },
                amount: {
                    type: "string",
                    description: "Value of the deal"
                },
                base_currency_amount: {
                    type: "string",
                    description: "Value of the deal in base currency"
                },
                expected_close: {
                    type: "string",
                    description: "The date when the deal is expected to close",
                    format: "date"
                },
                closed_date: {
                    type: "string",
                    description: "The date when the deal is closed",
                    format: "date"
                },
                stage_updated_time: {
                    type: "string",
                    description: "Timestamp when the deal stage was last updated",
                    format: "date-time"
                },
                custom_field: {
                    type: "object",
                    description: "Key-value pairs of custom fields for the deal",
                    additionalProperties: true
                },
                probability: {
                    type: "integer",
                    description: "The probability of winning the deal",
                    minimum: 0,
                    maximum: 100
                },
                updated_at: {
                    type: "string",
                    description: "Deal updated timestamp",
                    format: "date-time"
                },
                created_at: {
                    type: "string",
                    description: "Deal creation timestamp",
                    format: "date-time"
                },
                age: {
                    type: "integer",
                    description: "Age of the deal"
                },
                owner_id: {
                    type: "integer",
                    description: "ID of the user to whom the deal has been assigned"
                }
            }
        }
    }
};

module.exports = { inputSchema, outputSchema };
