// Auto-generated schema. Do not edit.

const inputSchema = {
    type: "object",
    properties: {
        id: {
            type: "integer",
            description: "The ID of the contact to update"
        },
        contact: {
            type: "object",
            description: "Contact property data object with fields to update",
            properties: {
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
                    description: "Email address of the contact"
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
                },
                custom_field: {
                    type: "object",
                    description: "Custom fields for the contact",
                    properties: {
                        cf_is_active: {
                            type: "boolean",
                            description: "Custom field indicating if the contact is active"
                        }
                    }
                }
            }
        }
    },
    required: [
        "id",
        "contact"
    ]
};

const outputSchema = {
    type: "object",
    properties: {
        contact: {
            type: "object",
            description: "The updated contact object",
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
                    description: "Email address of the contact"
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
                            description: "URL path to contact conversations"
                        },
                        activities: {
                            type: "string",
                            description: "URL path to contact activities"
                        }
                    }
                },
                custom_field: {
                    type: "object",
                    description: "Custom fields for the contact",
                    properties: {
                        cf_is_active: {
                            type: "boolean",
                            description: "Custom field indicating if the contact is active"
                        }
                    }
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
        }
    }
};

module.exports = { inputSchema, outputSchema };
