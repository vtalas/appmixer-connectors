// Auto-generated schema. Do not edit.

const inputSchema = {
    type: "object",
    properties: {
        id: {
            type: "integer",
            description: "The ID of the contact whose team members are being managed"
        },
        team_users: {
            type: "array",
            description: "Array of team member objects to add, update, or remove",
            items: {
                type: "object",
                required: [
                    "user_id",
                    "designation_id"
                ],
                properties: {
                    user_id: {
                        type: "integer",
                        description: "The ID of the user to add/update/remove from the team"
                    },
                    designation_id: {
                        type: "integer",
                        description: "The designation ID for the team member"
                    },
                    _destroy: {
                        type: "boolean",
                        description: "Set to true to remove the user from the contact team"
                    }
                }
            }
        }
    },
    required: [
        "id",
        "team_users"
    ]
};

const outputSchema = {
    type: "object",
    properties: {
        team_users: {
            type: "array",
            description: "Array of team member objects",
            items: {
                type: "object",
                properties: {
                    entity_id: {
                        type: "integer",
                        description: "The entity ID of the contact"
                    },
                    user_id: {
                        type: "integer",
                        description: "The ID of the team member user"
                    },
                    designation_id: {
                        type: "integer",
                        description: "The designation ID for the team member"
                    },
                    created_at: {
                        type: "string",
                        description: "Timestamp when the team member was added",
                        format: "date-time"
                    },
                    updated_at: {
                        type: "string",
                        description: "Timestamp when the team member was last updated",
                        format: "date-time"
                    }
                }
            }
        }
    }
};

module.exports = { inputSchema, outputSchema };
