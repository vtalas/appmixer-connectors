// Auto-generated schema. Do not edit.

const inputSchema = {
    type: "object",
    properties: {}
};

const outputSchema = {
    type: "object",
    properties: {
        filters: {
            type: "array",
            description: "Array of filter/view objects",
            items: {
                type: "object",
                properties: {
                    id: {
                        type: "integer",
                        description: "Unique identifier of the filter/view",
                        format: "int64"
                    },
                    name: {
                        type: "string",
                        description: "Name of the filter/view (e.g., My Contacts, All Contacts, New Contacts, Recently Modified, Never Contacted)"
                    },
                    model_class_name: {
                        type: "string",
                        description: "The model class this filter applies to (e.g., Contact)"
                    },
                    user_id: {
                        type: "integer",
                        description: "User ID who owns this filter. -1 indicates a system default filter",
                        format: "int64"
                    },
                    is_default: {
                        type: "boolean",
                        description: "Whether this is a default system filter"
                    },
                    is_public: {
                        type: "boolean",
                        description: "Whether this filter is publicly visible to all users"
                    },
                    updated_at: {
                        type: "string",
                        description: "Timestamp when the filter was last updated",
                        format: "date-time"
                    }
                }
            }
        }
    }
};

module.exports = { inputSchema, outputSchema };
