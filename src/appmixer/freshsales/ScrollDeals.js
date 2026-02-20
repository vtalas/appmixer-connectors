// Auto-generated schema. Do not edit.

const inputSchema = {
    type: "object",
    properties: {
        view_id: {
            type: "integer",
            description: "The ID of the view to scroll through"
        },
        limit: {
            type: "integer",
            description: "Number of deals to return per request"
        },
        last_fetched_id: {
            type: "integer",
            description: "ID of the last deal fetched in the previous request, used as cursor for pagination"
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
                        description: "Deal amount as a string"
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
                    }
                }
            }
        },
        meta: {
            type: "object",
            description: "Pagination and metadata information",
            properties: {
                last_fetched_id: {
                    type: "integer",
                    description: "ID of the last deal in the current response, use as cursor for next request"
                },
                has_next_page: {
                    type: "boolean",
                    description: "Whether there are more deals to fetch"
                },
                avatar_data: {
                    type: "object",
                    description: "Avatar data for the deals",
                    properties: {
                        Deal: {
                            type: "object",
                            description: "Map of deal IDs to avatar URLs (nullable values)"
                        }
                    }
                }
            }
        }
    }
};

module.exports = { inputSchema, outputSchema };
