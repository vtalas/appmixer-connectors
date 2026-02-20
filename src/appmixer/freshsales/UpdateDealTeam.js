// Auto-generated schema. Do not edit.

const inputSchema = {
    type: "object",
    properties: {
        id: {
            type: "integer",
            description: "The ID of the deal"
        },
        team_users: {
            type: "array",
            description: "List of team member objects to add, update, or remove",
            items: {
                type: "object",
                required: [
                    "user_id",
                    "designation_id"
                ],
                properties: {
                    user_id: {
                        type: "integer",
                        description: "ID of the user to add/update/remove"
                    },
                    designation_id: {
                        type: "integer",
                        description: "ID of the designation/role for the team member"
                    },
                    _destroy: {
                        type: "boolean",
                        description: "Set to true to remove this user from the deal team"
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
            description: "List of team member objects after the update",
            items: {
                type: "object",
                properties: {
                    entity_id: {
                        type: "integer",
                        description: "ID of the deal entity"
                    },
                    user_id: {
                        type: "integer",
                        description: "ID of the team member user"
                    },
                    designation_id: {
                        type: "integer",
                        description: "ID of the designation/role"
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
