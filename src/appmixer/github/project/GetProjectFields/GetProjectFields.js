module.exports = {
    async receive(context) {
        const { projectId } = context.messages.in;

        if (!projectId) {
            throw new Error('Project ID is required');
        }

        try {
            const query = `
                query($projectId: ID!) {
                    node(id: $projectId) {
                        ... on ProjectV2 {
                            fields(first: 50) {
                                nodes {
                                    ... on ProjectV2Field {
                                        id
                                        name
                                        __typename
                                    }
                                    ... on ProjectV2IterationField {
                                        id
                                        name
                                        __typename
                                        configuration {
                                            iterations {
                                                startDate
                                                id
                                            }
                                        }
                                    }
                                    ... on ProjectV2SingleSelectField {
                                        id
                                        name
                                        __typename
                                        options {
                                            id
                                            name
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            `;

            const response = await context.httpRequest({
                method: 'POST',
                url: 'https://api.github.com/graphql',
                headers: {
                    'Authorization': `Bearer ${context.auth.accessToken}`,
                    'Content-Type': 'application/json',
                    'User-Agent': 'Appmixer-GitHub-Projects-Connector'
                },
                data: {
                    query,
                    variables: { projectId }
                }
            });

            if (response.data.errors) {
                throw new Error(`GraphQL errors: ${JSON.stringify(response.data.errors)}`);
            }

            const project = response.data.data.node;
            if (!project) {
                throw new Error('Project not found');
            }

            const fields = project.fields.nodes.map(field => {
                const baseField = {
                    id: field.id,
                    name: field.name,
                    type: field.__typename
                };

                // Add type-specific properties
                switch (field.__typename) {
                    case 'ProjectV2SingleSelectField':
                        return {
                            ...baseField,
                            options: field.options || []
                        };
                    
                    case 'ProjectV2IterationField':
                        return {
                            ...baseField,
                            iterations: field.configuration?.iterations || []
                        };
                    
                    default:
                        return baseField;
                }
            });

            return context.sendJson({
                fields
            }, 'out');

        } catch (error) {
            throw new Error(`Failed to get project fields: ${error.message}`);
        }
    }
};