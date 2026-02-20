// Auto-generated schema. Do not edit.

const inputSchema = {
    type: "object",
    properties: {
        view_id: {
            type: "integer",
            description: "The ID of the view/filter to scroll through"
        },
        limit: {
            type: "integer",
            description: "The number of records to fetch. Used to limit the result set size."
        },
        last_fetched_id: {
            type: "integer",
            description: "The ID of the last record fetched in the previous page. Used to paginate to the next set of records.",
            format: "int64"
        }
    },
    required: [
        "view_id"
    ]
};

const outputSchema = {
    type: "object",
    properties: {
        contacts: {
            type: "array",
            description: "List of contacts returned by the scroll",
            items: {
                type: "object",
                properties: {
                    id: {
                        type: "integer",
                        description: "Unique identifier for the contact",
                        format: "int64"
                    },
                    job_title: {
                        type: "string",
                        description: "Job title of the contact"
                    },
                    lead_score: {
                        type: "integer",
                        description: "Lead score of the contact"
                    },
                    email: {
                        type: "string",
                        description: "Email address of the contact",
                        format: "email"
                    },
                    work_number: {
                        type: "string",
                        description: "Work phone number of the contact"
                    },
                    mobile_number: {
                        type: "string",
                        description: "Mobile phone number of the contact"
                    },
                    open_deals_amount: {
                        type: "string",
                        description: "Total amount of open deals associated with the contact"
                    },
                    display_name: {
                        type: "string",
                        description: "Display name of the contact"
                    },
                    avatar: {
                        type: "string",
                        description: "URL of the contact's avatar image",
                        format: "uri"
                    },
                    last_contacted_mode: {
                        type: "string",
                        description: "Mode of the last contact interaction"
                    },
                    last_contacted: {
                        type: "string",
                        description: "Timestamp of when the contact was last contacted",
                        format: "date-time"
                    },
                    first_name: {
                        type: "string",
                        description: "First name of the contact"
                    },
                    last_name: {
                        type: "string",
                        description: "Last name of the contact"
                    },
                    city: {
                        type: "string",
                        description: "City of the contact"
                    },
                    country: {
                        type: "string",
                        description: "Country of the contact"
                    },
                    created_at: {
                        type: "string",
                        description: "Timestamp when the contact was created",
                        format: "date-time"
                    },
                    updated_at: {
                        type: "string",
                        description: "Timestamp when the contact was last updated",
                        format: "date-time"
                    }
                }
            }
        },
        meta: {
            type: "object",
            description: "Metadata about the scroll response",
            properties: {
                has_next_page: {
                    type: "boolean",
                    description: "Indicates whether there are more records to fetch"
                }
            }
        }
    }
};

module.exports = { inputSchema, outputSchema };
