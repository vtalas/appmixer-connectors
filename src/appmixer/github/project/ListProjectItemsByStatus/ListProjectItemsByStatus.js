module.exports = {
    async receive(context) {
        const { projectId, statusValue, statusFieldName = 'Status', limit = 50 } = context.messages.in;

        if (!projectId || !statusValue) {
            throw new Error('Project ID and status value are required');
        }

        try {
            // First, get the project fields to find the status field ID
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

            // Find the status option ID if it's a single select field
            let statusOptionId = null;
            if (statusField.__typename === 'ProjectV2SingleSelectField') {
                const statusOption = statusField.options.find(option => option.name === statusValue);
                if (!statusOption) {
                    throw new Error(`Status value '${statusValue}' not found in field '${statusFieldName}'`);
                }
                statusOptionId = statusOption.id;
            }

            // Now get the project items
            const itemsQuery = `
                query($projectId: ID!, $limit: Int!) {
                    node(id: $projectId) {
                        ... on ProjectV2 {
                            items(first: $limit) {
                                totalCount
                                nodes {
                                    id
                                    fieldValues(first: 20) {
                                        nodes {
                                            ... on ProjectV2ItemFieldTextValue {
                                                text
                                                field {
                                                    ... on ProjectV2FieldCommon {
                                                        id
                                                        name
                                                    }
                                                }
                                            }
                                            ... on ProjectV2ItemFieldDateValue {
                                                date
                                                field {
                                                    ... on ProjectV2FieldCommon {
                                                        id
                                                        name
                                                    }
                                                }
                                            }
                                            ... on ProjectV2ItemFieldSingleSelectValue {
                                                name
                                                optionId
                                                field {
                                                    ... on ProjectV2FieldCommon {
                                                        id
                                                        name
                                                    }
                                                }
                                            }
                                        }
                                    }
                                    content {
                                        ... on DraftIssue {
                                            title
                                            body
                                        }
                                        ... on Issue {
                                            title
                                            url
                                            repository {
                                                name
                                                owner {
                                                    login
                                                }
                                            }
                                            assignees(first: 10) {
                                                nodes {
                                                    login
                                                }
                                            }
                                            labels(first: 10) {
                                                nodes {
                                                    name
                                                }
                                            }
                                        }
                                        ... on PullRequest {
                                            title
                                            url
                                            repository {
                                                name
                                                owner {
                                                    login
                                                }
                                            }
                                            assignees(first: 10) {
                                                nodes {
                                                    login
                                                }
                                            }
                                            labels(first: 10) {
                                                nodes {
                                                    name
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            `;

            const itemsResponse = await context.httpRequest({
                method: 'POST',
                url: 'https://api.github.com/graphql',
                headers: {
                    'Authorization': `Bearer ${context.auth.accessToken}`,
                    'Content-Type': 'application/json',
                    'User-Agent': 'Appmixer-GitHub-Projects-Connector'
                },
                data: {
                    query: itemsQuery,
                    variables: { projectId, limit }
                }
            });

            if (itemsResponse.data.errors) {
                throw new Error(`GraphQL errors: ${JSON.stringify(itemsResponse.data.errors)}`);
            }

            const projectData = itemsResponse.data.data.node;
            const totalCount = projectData.items.totalCount;
            const items = projectData.items.nodes || [];

            // Filter items by status
            const filteredItems = items.filter(item => {
                const statusFieldValue = item.fieldValues.nodes.find(fieldValue => {
                    if (fieldValue.field.name === statusFieldName) {
                        if (statusField.__typename === 'ProjectV2SingleSelectField') {
                            return fieldValue.optionId === statusOptionId;
                        } else {
                            return fieldValue.text === statusValue;
                        }
                    }
                    return false;
                });
                return !!statusFieldValue;
            });

            // Transform the filtered items to a more usable format
            const transformedItems = filteredItems.map(item => {
                const fieldValues = {};
                item.fieldValues.nodes.forEach(fieldValue => {
                    const fieldName = fieldValue.field.name;
                    if (fieldValue.text !== undefined) {
                        fieldValues[fieldName] = fieldValue.text;
                    } else if (fieldValue.date !== undefined) {
                        fieldValues[fieldName] = fieldValue.date;
                    } else if (fieldValue.name !== undefined) {
                        fieldValues[fieldName] = fieldValue.name;
                    }
                });

                let title = 'Untitled';
                let type = 'Unknown';
                let url = null;
                let repository = null;
                let assignees = [];
                let labels = [];

                if (item.content) {
                    title = item.content.title || 'Untitled';
                    
                    if (item.content.__typename === 'DraftIssue') {
                        type = 'Draft Issue';
                    } else if (item.content.__typename === 'Issue') {
                        type = 'Issue';
                        url = item.content.url;
                        repository = item.content.repository ? 
                            `${item.content.repository.owner.login}/${item.content.repository.name}` : null;
                        assignees = item.content.assignees?.nodes?.map(a => a.login) || [];
                        labels = item.content.labels?.nodes?.map(l => l.name) || [];
                    } else if (item.content.__typename === 'PullRequest') {
                        type = 'Pull Request';
                        url = item.content.url;
                        repository = item.content.repository ? 
                            `${item.content.repository.owner.login}/${item.content.repository.name}` : null;
                        assignees = item.content.assignees?.nodes?.map(a => a.login) || [];
                        labels = item.content.labels?.nodes?.map(l => l.name) || [];
                    }
                }

                return {
                    id: item.id,
                    title,
                    type,
                    status: statusValue,
                    assignees,
                    url,
                    repository,
                    labels,
                    fieldValues
                };
            });

            return context.sendJson({
                items: transformedItems,
                totalCount,
                filteredCount: transformedItems.length
            }, 'out');

        } catch (error) {
            throw new Error(`Failed to list project items by status: ${error.message}`);
        }
    }
};