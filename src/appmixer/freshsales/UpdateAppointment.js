// Auto-generated schema. Do not edit.

const inputSchema = {
    type: "object",
    properties: {
        appointment_id: {
            type: "integer",
            description: "The ID of the appointment to update"
        },
        appointment: {
            type: "object",
            description: "Appointment object containing fields to update",
            properties: {
                title: {
                    type: "string",
                    description: "Title of the appointment"
                },
                description: {
                    type: "string",
                    description: "Description of the appointment"
                },
                from_date: {
                    type: "string",
                    description: "Start date and time of the appointment in ISO 8601 format",
                    format: "date-time"
                },
                end_date: {
                    type: "string",
                    description: "End date and time of the appointment in ISO 8601 format",
                    format: "date-time"
                },
                time_zone: {
                    type: "string",
                    description: "Time zone for the appointment (e.g., \"Hawaii\")"
                },
                location: {
                    type: "string",
                    description: "Location of the appointment"
                },
                latitude: {
                    type: "string",
                    description: "Latitude coordinate of the appointment location"
                },
                longitude: {
                    type: "string",
                    description: "Longitude coordinate of the appointment location"
                },
                appointment_attendee_ids: {
                    type: "array",
                    description: "Array of attendee IDs for the appointment",
                    items: {
                        type: "integer"
                    }
                }
            }
        }
    },
    required: [
        "appointment_id",
        "appointment"
    ]
};

const outputSchema = {
    type: "object",
    properties: {
        appointment: {
            type: "object",
            description: "The updated appointment object",
            properties: {
                id: {
                    type: "integer",
                    description: "Unique identifier of the appointment"
                },
                title: {
                    type: "string",
                    description: "Title of the appointment"
                },
                description: {
                    type: "string",
                    description: "Description of the appointment"
                },
                from_date: {
                    type: "string",
                    description: "Start date and time in ISO 8601 format",
                    format: "date-time"
                },
                end_date: {
                    type: "string",
                    description: "End date and time in ISO 8601 format",
                    format: "date-time"
                },
                time_zone: {
                    type: "string",
                    description: "Time zone of the appointment"
                },
                location: {
                    type: "string",
                    description: "Location of the appointment"
                },
                latitude: {
                    type: "string",
                    description: "Latitude coordinate of the location"
                },
                longitude: {
                    type: "string",
                    description: "Longitude coordinate of the location"
                },
                appointment_attendee_ids: {
                    type: "array",
                    description: "Array of attendee IDs",
                    items: {
                        type: "integer"
                    }
                }
            }
        },
        appointment_attendees: {
            type: "array",
            description: "List of appointment attendee association objects",
            items: {
                type: "object",
                properties: {
                    id: {
                        type: "integer",
                        description: "Unique identifier of the attendee association"
                    },
                    attendee: {
                        type: "object",
                        description: "The attendee reference",
                        properties: {
                            type: {
                                type: "string",
                                description: "Type of the attendee (e.g., \"lead\", \"FdMultitenant::User\")"
                            },
                            id: {
                                type: "integer",
                                description: "ID of the attendee entity"
                            }
                        }
                    }
                }
            }
        },
        users: {
            type: "array",
            description: "List of user attendees",
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
                    avatar: {
                        type: "string",
                        description: "URL of the user's avatar image, or null"
                    },
                    type: {
                        type: "string",
                        description: "Type identifier (e.g., \"FdMultitenant::User\")"
                    }
                }
            }
        },
        leads: {
            type: "array",
            description: "List of lead attendees",
            items: {
                type: "object",
                properties: {
                    id: {
                        type: "integer",
                        description: "Unique identifier of the lead"
                    },
                    display_name: {
                        type: "string",
                        description: "Display name of the lead"
                    },
                    avatar: {
                        type: "string",
                        description: "URL of the lead's avatar image, or null"
                    },
                    type: {
                        type: "string",
                        description: "Type identifier (e.g., \"Lead\")"
                    }
                }
            }
        }
    }
};

module.exports = { inputSchema, outputSchema };
