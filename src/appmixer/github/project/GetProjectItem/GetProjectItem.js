'use strict';

module.exports = {
    async receive(context) {
        const { projectItemId } = context.messages.in.content;

        const query = `
            query($projectItemId: ID!) {
                node(id: $projectItemId) {
                    ... on ProjectV2Item {
                        id
                        content {
                            ... on Issue {
                                id
                                title
                                url
                                number
                                repository {
                                    name
                                    owner {
                                        login
                                    }
                                }
                            }
                            ... on PullRequest {
                                id
                                title
                                url
                                number
                                repository {
                                    name
                                    owner {
                                        login
                                    }
                                }
                            }
                            ... on DraftIssue {
                                id
                                title
                            }
                        }
                        fieldValues(first: 20) {
                            nodes {
                                ... on ProjectV2ItemFieldTextValue {
                                    field {
                                        ... on ProjectV2Field {
                                            name
                                        }
                                    }
                                    text
                                }
                                ... on ProjectV2ItemFieldNumberValue {
                                    field {
                                        ... on ProjectV2Field {
                                            name
                                        }
                                    }
                                    number
                                }
                                ... on ProjectV2ItemFieldDateValue {
                                    field {
                                        ... on ProjectV2Field {
                                            name
                                        }
                                    }
                                    date
                                }
                                ... on ProjectV2ItemFieldSingleSelectValue {
                                    field {
                                        ... on ProjectV2SingleSelectField {
                                            name
                                        }
                                    }
                                    name
                                }
                                ... on ProjectV2ItemFieldIterationValue {
                                    field {
                                        ... on ProjectV2IterationField {
                                            name
                                        }
                                    }
                                    title
                                }
                            }
                        }
                    }
                }
            }
        `;

        const { data } = await context.httpRequest({
            method: 'POST',
            url: 'https://api.github.com/graphql',
            headers: {
                'Authorization': `Bearer ${context.auth.accessToken}`,
                'Content-Type': 'application/json'
            },
            data: {
                query,
                variables: { projectItemId }
            }
        });

        if (data.errors) {
            throw new Error(`GraphQL errors: ${JSON.stringify(data.errors)}`);
        }

        const item = data.data.node;
        if (!item) {
            throw new Error(`Project item with ID '${projectItemId}' not found`);
        }

        // Process the item to add easier access to status and other fields
        const processedItem = {
            id: item.id,
            content: item.content,
            fieldValues: item.fieldValues.nodes || [],
            status: null
        };

        // Find status field value
        const statusField = item.fieldValues.nodes.find(fv =>
            fv.field && fv.field.name && fv.field.name.toLowerCase() === 'status'
        );

        if (statusField) {
            processedItem.status = statusField.name || statusField.text || statusField.title;
        }

        return context.sendJson(processedItem, 'out');
    }
};
