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
            description: "List of available deal filters/views",
            items: {
                type: "object",
                properties: {
                    id: {
                        type: "integer",
                        description: "Unique identifier of the filter/view"
                    },
                    name: {
                        type: "string",
                        description: "Name of the filter/view (e.g. Open Deals, My Deals, Lost Deals)"
                    },
                    model_class_name: {
                        type: "string",
                        description: "The model class this filter applies to",
                        enum: [
                            "Deal"
                        ]
                    },
                    user_id: {
                        type: "integer",
                        description: "ID of the user who owns the filter (-1 for system filters)"
                    },
                    is_default: {
                        type: "boolean",
                        description: "Whether this is a default filter"
                    },
                    is_public: {
                        type: "boolean",
                        description: "Whether this filter is publicly visible"
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
