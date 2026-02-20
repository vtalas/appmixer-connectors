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
                        description: "Unique identifier of the filter/view"
                    },
                    name: {
                        type: "string",
                        description: "Name of the filter/view (e.g., My Leads, New Leads, Unassigned Leads)"
                    },
                    model_class_name: {
                        type: "string",
                        description: "Model class name the filter applies to (e.g., Lead)"
                    },
                    user_id: {
                        type: "integer",
                        description: "User ID who owns the filter. -1 indicates a system-wide filter."
                    },
                    is_default: {
                        type: "boolean",
                        description: "Whether this is a default filter"
                    },
                    is_public: {
                        type: "boolean",
                        description: "Whether this filter is publicly available"
                    },
                    updated_at: {
                        type: "string",
                        description: "Last updated timestamp of the filter",
                        format: "date-time"
                    }
                }
            }
        }
    }
};

module.exports = { inputSchema, outputSchema };
