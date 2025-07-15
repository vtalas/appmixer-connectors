module.exports = {
    async receive(context) {
        const { projectId, itemId, statusValue, statusFieldName = 'Status' } = context.messages.in.content || context.messages.in || {};

        if (!projectId || !itemId || !statusValue) {
            throw new Error('Project ID, Item ID, and Status Value are required');
        }

        try {
            // First, get the project fields to find the status field and option ID
            const fieldsQuery = `
                query($projectId: ID!) {
                    node(id: $projectId) {
                        ... on ProjectV2 {
                            fields(first: 20) {
                                nodes {
                                    ... on ProjectV2FieldCommon {
                                        id
                                        name
                                        __typename
                                    }
                                    ... on ProjectV2SingleSelectField {
                                        id
                                        name
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

            const fieldsResponse = await context.httpRequest({
                method: 'POST',
                url: 'https://api.github.com/graphql',
                headers: {
                    'Authorization': `Bearer ${context.auth.accessToken}`,
                    'Content-Type': 'application/json',
                    'User-Agent': 'Appmixer-GitHub-Projects-Connector'
                },
                data: {
                    query: fieldsQuery,
                    variables: { projectId }
                }
            });

            if (fieldsResponse.data.errors) {
                throw new Error(`GraphQL errors: ${JSON.stringify(fieldsResponse.data.errors)}`);
            }

            const fields = fieldsResponse.data.data.node?.fields?.nodes || [];
            const statusField = fields.find(field => field.name === statusFieldName);

            if (!statusField) {
                throw new Error(`Status field '${statusFieldName}' not found in project`);
            }

            let updateValue;
            if (statusField.__typename === 'ProjectV2SingleSelectField') {
                const statusOption = statusField.options.find(option => option.name === statusValue);
                if (!statusOption) {
                    throw new Error(`Status value '${statusValue}' not found in field '${statusFieldName}'`);
                }
                updateValue = { singleSelectOptionId: statusOption.id };
            } else {
                // For text fields
                updateValue = { text: statusValue };
            }

            // Update the project item field value
            const updateMutation = `
                mutation($projectId: ID!, $itemId: ID!, $fieldId: ID!, $value: ProjectV2FieldValue!) {
                    updateProjectV2ItemFieldValue(input: {
                        projectId: $projectId
                        itemId: $itemId
                        fieldId: $fieldId
                        value: $value
                    }) {
                        projectV2Item {
                            id
                        }
                    }
                }
            `;

            const updateResponse = await context.httpRequest({
                method: 'POST',
                url: 'https://api.github.com/graphql',
                headers: {
                    'Authorization': `Bearer ${context.auth.accessToken}`,
                    'Content-Type': 'application/json',
                    'User-Agent': 'Appmixer-GitHub-Projects-Connector'
                },
                data: {
                    query: updateMutation,
                    variables: {
                        projectId,
                        itemId,
                        fieldId: statusField.id,
                        value: updateValue
                    }
                }
            });

            if (updateResponse.data.errors) {
                throw new Error(`GraphQL errors: ${JSON.stringify(updateResponse.data.errors)}`);
            }

            const result = updateResponse.data.data.updateProjectV2ItemFieldValue;
            if (!result?.projectV2Item?.id) {
                throw new Error('Failed to update project item status');
            }

            return context.sendJson({
                itemId: result.projectV2Item.id,
                success: true,
                status: statusValue
            }, 'out');

        } catch (error) {
            throw new Error(`Failed to update project item status: ${error.message}`);
        }
    }
};