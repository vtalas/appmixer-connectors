// Auto-generated schema. Do not edit.

const inputSchema = {
    type: "object",
    properties: {
        filter: {
            type: "string",
            description: "Filter type for appointments. Only one filter is allowed at a time. Getting multiple filtered appointments is not possible.",
            enum: [
                "open",
                "overdue",
                "complete"
            ]
        },
        include: {
            type: "string",
            description: "Use 'include' to embed additional details in the response. 'creater' returns Collaborators id, avatar, type and display_name. 'targetable' returns the targetable's id, avatar and display_name. 'appointment_attendees' returns attendee details.",
            enum: [
                "creater",
                "targetable",
                "appointment_attendees"
            ]
        }
    },
    required: [
        "filter"
    ]
};

const outputSchema = {
    type: "object",
    properties: {
        users: {
            type: "array",
            description: "List of users associated with the appointments (included when include=creater)",
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
        appointments: {
            type: "array",
            description: "List of appointment objects",
            items: {
                type: "object",
                properties: {
                    id: {
                        type: "integer",
                        description: "Unique identifier of the appointment"
                    },
                    time_zone: {
                        type: "string",
                        description: "Time zone of the appointment"
                    },
                    title: {
                        type: "string",
                        description: "Title of the appointment"
                    },
                    description: {
                        type: "string",
                        description: "Description of the appointment"
                    },
                    location: {
                        type: "string",
                        description: "Location of the appointment"
                    },
                    from_date: {
                        type: "string",
                        description: "Start date and time of the appointment",
                        format: "date-time"
                    },
                    end_date: {
                        type: "string",
                        description: "End date and time of the appointment",
                        format: "date-time"
                    },
                    creater_id: {
                        type: "integer",
                        description: "ID of the user who created the appointment"
                    },
                    latitude: {
                        type: "string",
                        description: "Latitude coordinate of the appointment location"
                    },
                    longitude: {
                        type: "string",
                        description: "Longitude coordinate of the appointment location"
                    },
                    checkedin_at: {
                        type: "string",
                        description: "Timestamp when the user checked in at the appointment location",
                        format: "date-time"
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
                    description: "Total number of appointments matching the filter"
                }
            }
        }
    }
};

module.exports = { inputSchema, outputSchema };
