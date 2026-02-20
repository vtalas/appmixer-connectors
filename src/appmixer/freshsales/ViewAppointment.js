// Auto-generated schema. Do not edit.

const inputSchema = {
    type: "object",
    properties: {
        appointment_id: {
            type: "number",
            description: "ID of the appointment to view"
        }
    },
    required: [
        "appointment_id"
    ]
};

const outputSchema = {
    type: "object",
    properties: {
        appointment: {
            type: "object",
            description: "The appointment object",
            properties: {
                id: {
                    type: "number",
                    description: "Unique ID of the appointment"
                },
                time_zone: {
                    type: "string",
                    description: "Timezone that the appointment is scheduled in"
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
                    description: "Timestamp that denotes the start of appointment",
                    format: "date-time"
                },
                end_date: {
                    type: "string",
                    description: "Timestamp that denotes the end of appointment",
                    format: "date-time"
                },
                latitude: {
                    type: "string",
                    description: "Latitude of the location when you check in for an appointment"
                },
                longitude: {
                    type: "string",
                    description: "Longitude of the location when you check in for an appointment"
                },
                appointment_attendee_ids: {
                    type: "array",
                    description: "List of appointment attendee IDs",
                    items: {
                        type: "number",
                        description: "Attendee ID"
                    }
                }
            }
        },
        appointment_attendees: {
            type: "array",
            description: "List of appointment attendees",
            items: {
                type: "object",
                properties: {
                    id: {
                        type: "number",
                        description: "Unique ID of the appointment attendee record"
                    },
                    attendee: {
                        type: "object",
                        description: "Attendee reference",
                        properties: {
                            type: {
                                type: "string",
                                description: "Type of the attendee (e.g. user, lead)"
                            },
                            id: {
                                type: "number",
                                description: "ID of the attendee"
                            }
                        }
                    }
                }
            }
        },
        users: {
            type: "array",
            description: "List of user attendees with details",
            items: {
                type: "object",
                properties: {
                    id: {
                        type: "number",
                        description: "Unique ID of the user"
                    },
                    display_name: {
                        type: "string",
                        description: "Display name of the user"
                    },
                    avatar: {
                        type: "string",
                        description: "Avatar URL of the user"
                    },
                    type: {
                        type: "string",
                        description: "Type identifier of the user"
                    }
                }
            }
        },
        leads: {
            type: "array",
            description: "List of lead attendees with details",
            items: {
                type: "object",
                properties: {
                    id: {
                        type: "number",
                        description: "Unique ID of the lead"
                    },
                    display_name: {
                        type: "string",
                        description: "Display name of the lead"
                    },
                    avatar: {
                        type: "string",
                        description: "Avatar URL of the lead"
                    },
                    type: {
                        type: "string",
                        description: "Type identifier of the lead"
                    }
                }
            }
        }
    }
};

module.exports = { inputSchema, outputSchema };
