// Auto-generated schema. Do not edit.

const inputSchema = {
    type: "object",
    properties: {
        id: {
            type: "integer",
            description: "The ID of the lead to convert"
        },
        lead: {
            type: "object",
            description: "Lead object containing conversion details",
            required: [
                "last_name",
                "company"
            ],
            properties: {
                first_name: {
                    type: "string",
                    description: "First name of the lead"
                },
                last_name: {
                    type: "string",
                    description: "Last name of the lead (mandatory)"
                },
                email: {
                    type: "string",
                    description: "Email address of the lead",
                    format: "email"
                },
                company: {
                    type: "object",
                    description: "Company details (name is mandatory)",
                    required: [
                        "name"
                    ],
                    properties: {
                        name: {
                            type: "string",
                            description: "Name of the company (mandatory)"
                        }
                    }
                },
                deal: {
                    type: "object",
                    description: "Optional deal to create during lead conversion",
                    properties: {
                        name: {
                            type: "string",
                            description: "Name of the deal"
                        },
                        amount: {
                            type: "string",
                            description: "Amount of the deal"
                        }
                    }
                }
            }
        }
    },
    required: [
        "id",
        "lead"
    ]
};

const outputSchema = {
    type: "object",
    properties: {
        contact: {
            type: "object",
            description: "The newly created contact from the converted lead",
            properties: {
                id: {
                    type: "integer",
                    description: "Unique identifier of the contact"
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
                    description: "Work phone number"
                },
                mobile_number: {
                    type: "string",
                    description: "Mobile phone number"
                },
                address: {
                    type: "string",
                    description: "Address of the contact"
                },
                last_seen: {
                    type: "string",
                    description: "Last seen timestamp",
                    format: "date-time"
                },
                lead_score: {
                    type: "integer",
                    description: "Lead score of the contact"
                },
                last_contacted: {
                    type: "string",
                    description: "Last contacted timestamp",
                    format: "date-time"
                },
                open_deals_amount: {
                    type: "string",
                    description: "Total amount of open deals"
                },
                links: {
                    type: "object",
                    description: "Related resource links",
                    properties: {
                        conversations: {
                            type: "string",
                            description: "URL to fetch conversations for the contact"
                        },
                        activities: {
                            type: "string",
                            description: "URL to fetch activities for the contact"
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
                    }
                },
                updated_at: {
                    type: "string",
                    description: "Last updated timestamp",
                    format: "date-time"
                },
                keyword: {
                    type: "string",
                    description: "Keyword associated with the contact"
                },
                medium: {
                    type: "string",
                    description: "Medium associated with the contact"
                },
                facebook: {
                    type: "string",
                    description: "Facebook profile URL"
                },
                twitter: {
                    type: "string",
                    description: "Twitter profile URL"
                },
                linkedin: {
                    type: "string",
                    description: "LinkedIn profile URL"
                }
            }
        },
        meta: {
            type: "object",
            description: "Metadata about the operation",
            properties: {
                success_msg: {
                    type: "string",
                    description: "Success message confirming conversion"
                }
            }
        }
    }
};

module.exports = { inputSchema, outputSchema };
