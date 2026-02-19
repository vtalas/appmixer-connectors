// Auto-generated schema. Do not edit.

const inputSchema = {
    type: "object",
    properties: {
        view_id: {
            type: "integer",
            description: "The ID of the view to use for filtering leads. Obtain this from the /api/leads/filters endpoint."
        }
    },
    required: [
        "view_id"
    ]
};

const outputSchema = {
    type: "object",
    properties: {
        leads: {
            type: "array",
            description: "Array of lead objects",
            items: {
                type: "object",
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
                    }
                }
            }
        }
    }
};

module.exports = { inputSchema, outputSchema };
