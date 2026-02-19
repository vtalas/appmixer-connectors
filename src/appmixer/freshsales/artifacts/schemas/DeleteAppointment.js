// Auto-generated schema. Do not edit.

const inputSchema = {
    type: "object",
    properties: {
        appointment_id: {
            type: "integer",
            description: "The ID of the appointment to delete"
        }
    },
    required: [
        "appointment_id"
    ]
};

const outputSchema = {
    type: "object",
    properties: {
        success: {
            type: "string",
            description: "HTTP status code indicating success"
        }
    }
};

module.exports = { inputSchema, outputSchema };
