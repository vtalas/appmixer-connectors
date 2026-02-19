// Auto-generated schema. Do not edit.

const inputSchema = {
    type: "object",
    properties: {
        id: {
            type: "integer",
            description: "The unique identifier of the contact",
            format: "int64"
        },
        include: {
            type: "string",
            description: "Comma-separated list of associated resources to include. Supported values: sales_accounts"
        }
    },
    required: [
        "id"
    ]
};

const outputSchema = {
    type: "object",
    properties: {
        contact: {
            type: "object",
            description: "The contact object",
            properties: {
                id: {
                    type: "integer",
                    description: "Unique identifier of the contact",
                    format: "int64"
                },
                first_name: {
                    type: "string",
                    description: "First name of the contact"
                },
                last_name: {
                    type: "string",
                    description: "Last name of the contact"
                },
                display_name: {
                    type: "string",
                    description: "Display name of the contact"
                },
                avatar: {
                    type: "string",
                    description: "Avatar URL of the contact"
                },
                job_title: {
                    type: "string",
                    description: "Job title of the contact"
                },
                city: {
                    type: "string",
                    description: "City of the contact"
                },
                state: {
                    type: "string",
                    description: "State of the contact"
                },
                zipcode: {
                    type: "string",
                    description: "Zip code of the contact"
                },
                country: {
                    type: "string",
                    description: "Country of the contact"
                },
                email: {
                    type: "string",
                    description: "Email address of the contact",
                    format: "email"
                },
                time_zone: {
                    type: "string",
                    description: "Time zone of the contact"
                },
                work_number: {
                    type: "string",
                    description: "Work phone number of the contact"
                },
                mobile_number: {
                    type: "string",
                    description: "Mobile phone number of the contact"
                },
                address: {
                    type: "string",
                    description: "Address of the contact"
                },
                last_seen: {
                    type: "string",
                    description: "Timestamp when the contact was last seen",
                    format: "date-time"
                },
                lead_score: {
                    type: "integer",
                    description: "Lead score of the contact"
                },
                last_contacted: {
                    type: "string",
                    description: "Timestamp when the contact was last contacted",
                    format: "date-time"
                },
                open_deals_amount: {
                    type: "string",
                    description: "Total amount of open deals associated with the contact"
                },
                links: {
                    type: "object",
                    description: "Related resource links",
                    properties: {
                        conversations: {
                            type: "string",
                            description: "URL path to the contact's conversations"
                        },
                        activities: {
                            type: "string",
                            description: "URL path to the contact's activities"
                        }
                    }
                },
                custom_field: {
                    type: "object",
                    description: "Custom fields associated with the contact",
                    properties: {
                        cf_is_active: {
                            type: "boolean",
                            description: "Example custom field indicating if the contact is active"
                        }
                    },
                    additionalProperties: true
                },
                updated_at: {
                    type: "string",
                    description: "Timestamp when the contact was last updated",
                    format: "date-time"
                },
                keyword: {
                    type: "string",
                    description: "Keyword associated with the contact"
                },
                medium: {
                    type: "string",
                    description: "Medium through which the contact was acquired"
                },
                facebook: {
                    type: "string",
                    description: "Facebook profile URL of the contact"
                },
                twitter: {
                    type: "string",
                    description: "Twitter profile URL of the contact"
                },
                linkedin: {
                    type: "string",
                    description: "LinkedIn profile URL of the contact"
                },
                sales_accounts: {
                    type: "array",
                    description: "Associated sales accounts (included when requested via include parameter)",
                    items: {
                        type: "object",
                        properties: {
                            avatar: {
                                type: "string",
                                description: "Avatar URL of the sales account"
                            },
                            id: {
                                type: "integer",
                                description: "Unique identifier of the sales account",
                                format: "int64"
                            },
                            is_primary: {
                                type: "boolean",
                                description: "Whether this is the primary sales account for the contact"
                            },
                            name: {
                                type: "string",
                                description: "Name of the sales account"
                            },
                            partial: {
                                type: "boolean",
                                description: "Whether partial data is returned for the sales account"
                            },
                            website: {
                                type: "string",
                                description: "Website URL of the sales account"
                            }
                        }
                    }
                }
            }
        }
    }
};

module.exports = { inputSchema, outputSchema };
