// Auto-generated schema. Do not edit.

const inputSchema = {
    type: "object",
    properties: {
        unique_identifier: {
            type: "object",
            description: "Field based on which entity needs to be created or updated. Only 'id' and unique fields in the form can be used. The 'email' attribute is deprecated; use 'emails' instead.",
            properties: {
                emails: {
                    type: "string",
                    description: "Email address used as the unique identifier to find or create the contact"
                }
            }
        },
        contact: {
            type: "object",
            description: "Contact property data object",
            properties: {
                first_name: {
                    type: "string",
                    description: "First name of the contact"
                },
                last_name: {
                    type: "string",
                    description: "Last name of the contact"
                },
                mobile_number: {
                    type: "string",
                    description: "Mobile phone number of the contact"
                }
            }
        }
    },
    required: [
        "unique_identifier",
        "contact"
    ]
};

const outputSchema = {};

module.exports = { inputSchema, outputSchema };
