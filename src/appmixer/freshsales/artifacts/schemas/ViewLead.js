// Auto-generated schema. Do not edit.

const inputSchema = {
    type: "object",
    properties: {
        id: {
            type: "integer",
            description: "The ID of the lead to retrieve"
        },
        include: {
            type: "string",
            description: "Use 'include' to embed additional details in the response. Supported values: owner (returns owner id, name and email), creater (returns creater id, name and email), updater (returns updater id, name and email), source (returns id and name of the source), lead_stage (returns id and name of the lead stage), lead_reason (returns id and name of the lead reason), territory (returns id and name of the territory), campaign (returns id and name of the campaign), tasks (returns task id, title, due_date, status and owner_id), appointments (returns appointment id, title, time_zone, from_date, end_date and creater_id), notes (returns note id, description and creater_id)",
            enum: [
                "owner",
                "creater",
                "updater",
                "source",
                "lead_stage",
                "lead_reason",
                "territory",
                "campaign",
                "tasks",
                "appointments",
                "notes"
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
        lead: {
            type: "object",
            description: "The lead object",
            properties: {
                id: {
                    type: "integer",
                    description: "Unique identifier of the lead"
                },
                first_name: {
                    type: "string",
                    description: "First name of the lead"
                },
                last_name: {
                    type: "string",
                    description: "Last name of the lead"
                },
                email: {
                    type: "string",
                    description: "Email address of the lead",
                    format: "email"
                },
                job_title: {
                    type: "string",
                    description: "Job title of the lead"
                },
                work_number: {
                    type: "string",
                    description: "Work phone number of the lead"
                },
                mobile_number: {
                    type: "string",
                    description: "Mobile phone number of the lead"
                },
                address: {
                    type: "string",
                    description: "Street address of the lead"
                },
                city: {
                    type: "string",
                    description: "City of the lead"
                },
                state: {
                    type: "string",
                    description: "State of the lead"
                },
                zipcode: {
                    type: "string",
                    description: "Zip code of the lead"
                },
                country: {
                    type: "string",
                    description: "Country of the lead"
                },
                time_zone: {
                    type: "string",
                    description: "Time zone of the lead"
                },
                display_name: {
                    type: "string",
                    description: "Display name of the lead"
                },
                avatar: {
                    type: "string",
                    description: "URL of the lead's avatar image",
                    format: "uri"
                },
                keyword: {
                    type: "string",
                    description: "Keyword associated with the lead"
                },
                medium: {
                    type: "string",
                    description: "Medium through which the lead was acquired"
                },
                last_seen: {
                    type: "string",
                    description: "Timestamp when the lead was last seen",
                    format: "date-time"
                },
                last_contacted: {
                    type: "string",
                    description: "Timestamp when the lead was last contacted",
                    format: "date-time"
                },
                lead_score: {
                    type: "integer",
                    description: "Lead score value"
                },
                stage_updated_time: {
                    type: "string",
                    description: "Timestamp when the lead stage was last updated",
                    format: "date-time"
                },
                company: {
                    type: "object",
                    description: "Company associated with the lead",
                    properties: {
                        id: {
                            type: "integer",
                            description: "Unique identifier of the company"
                        },
                        name: {
                            type: "string",
                            description: "Name of the company"
                        },
                        address: {
                            type: "string",
                            description: "Street address of the company"
                        },
                        city: {
                            type: "string",
                            description: "City of the company"
                        },
                        state: {
                            type: "string",
                            description: "State of the company"
                        },
                        zipcode: {
                            type: "string",
                            description: "Zip code of the company"
                        },
                        country: {
                            type: "string",
                            description: "Country of the company"
                        },
                        number_of_employees: {
                            type: "integer",
                            description: "Number of employees in the company"
                        },
                        annual_revenue: {
                            type: "number",
                            description: "Annual revenue of the company"
                        },
                        website: {
                            type: "string",
                            description: "Website URL of the company",
                            format: "uri"
                        },
                        phone: {
                            type: "string",
                            description: "Phone number of the company"
                        },
                        industry_type_id: {
                            type: "integer",
                            description: "ID of the industry type"
                        },
                        business_type_id: {
                            type: "integer",
                            description: "ID of the business type"
                        }
                    }
                },
                deal: {
                    type: "object",
                    description: "Deal associated with the lead",
                    properties: {
                        name: {
                            type: "string",
                            description: "Name of the deal"
                        },
                        amount: {
                            type: "number",
                            description: "Amount of the deal"
                        }
                    }
                },
                links: {
                    type: "object",
                    description: "Related resource links",
                    properties: {
                        conversations: {
                            type: "string",
                            description: "URL path to the lead's conversations"
                        },
                        activities: {
                            type: "string",
                            description: "URL path to the lead's activities"
                        }
                    }
                },
                updated_at: {
                    type: "string",
                    description: "Timestamp when the lead was last updated",
                    format: "date-time"
                },
                facebook: {
                    type: "string",
                    description: "Facebook profile URL of the lead"
                },
                twitter: {
                    type: "string",
                    description: "Twitter profile URL of the lead"
                },
                linkedin: {
                    type: "string",
                    description: "LinkedIn profile URL of the lead"
                }
            }
        }
    }
};

module.exports = { inputSchema, outputSchema };
