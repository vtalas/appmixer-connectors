// Auto-generated schema. Do not edit.

const inputSchema = {
    type: "object",
    properties: {
        view_id: {
            type: "integer",
            description: "The ID of the view/filter to fetch deals from"
        },
        sort: {
            type: "string",
            description: "The deal field to sort by",
            enum: [
                "amount",
                "expected_close",
                "created_at",
                "updated_at",
                "last_contacted"
            ]
        },
        sort_type: {
            type: "string",
            description: "Sort deals in ascending or descending order",
            enum: [
                "asc",
                "desc"
            ]
        }
    },
    required: [
        "view_id"
    ]
};

const outputSchema = {
    type: "object",
    properties: {
        deals: {
            type: "array",
            description: "List of deal objects",
            items: {
                type: "object",
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
                        description: "Monetary value/amount of the deal"
                    },
                    expected_close: {
                        type: "string",
                        description: "Expected close date of the deal",
                        format: "date-time"
                    },
                    closed_date: {
                        type: "string",
                        description: "Date when the deal was closed",
                        format: "date-time"
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
                                description: "Example custom field for number of agents"
                            }
                        }
                    },
                    probability: {
                        type: "integer",
                        description: "Probability percentage of the deal closing"
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
                    }
                }
            }
        },
        meta: {
            type: "object",
            description: "Metadata about the response",
            properties: {
                total: {
                    type: "integer",
                    description: "Total number of deals matching the view"
                }
            }
        }
    }
};

module.exports = { inputSchema, outputSchema };
