// Auto-generated schema. Do not edit.

const inputSchema = {
    type: "object",
    properties: {
        deals: {
            type: "array",
            description: "Array of deal objects to create or update. Each object should contain a unique identifier and the deal data. Maximum 100 entities per request.",
            items: {
                type: "object",
                description: "Each hash should contain unique_identifier_name, unique_identifier_value, and data properties",
                required: [
                    "data"
                ],
                properties: {
                    name: {
                        type: "string",
                        description: "The unique identifier name (e.g., 'Account Name') used to match existing deals"
                    },
                    id: {
                        type: "string",
                        description: "The unique identifier value (e.g., deal ID) used to match existing deals"
                    },
                    data: {
                        type: "object",
                        description: "Deal property hash containing the fields to create or update",
                        properties: {
                            amount: {
                                type: "string",
                                description: "The monetary value of the deal"
                            }
                        }
                    }
                }
            }
        }
    },
    required: [
        "deals"
    ]
};

const outputSchema = {
    type: "object",
    properties: {
        message: {
            type: "string",
            description: "Confirmation message with the batch job ID"
        },
        job_status_url: {
            type: "string",
            description: "URL to track the progress of the bulk upsert job via the Job Status API",
            format: "uri"
        }
    }
};

module.exports = { inputSchema, outputSchema };
