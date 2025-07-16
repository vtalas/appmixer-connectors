'use strict';

const query = `
            query($projectItemId: ID!) {
                node(id: $projectItemId) {
                    ... on ProjectV2Item {
                        id
                        project {
                            id
                            title
                        }
                        content {
                            __typename
                            ... on Issue {
                                id
                                title
                                url
                                number
                                state
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
                                repository {
                                    name
                                    owner {
                                        login
                                    }
                                }
                                timelineItems(first: 20, itemTypes: [CONNECTED_EVENT, DISCONNECTED_EVENT]) {
                                    nodes {
                                        ... on ConnectedEvent {
                                            subject {
                                                ... on PullRequest {
                                                    id
                                                    title
                                                    url
                                                    number
                                                    state
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
                                                    repository {
                                                        name
                                                        owner {
                                                            login
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                            ... on PullRequest {
                                id
                                title
                                url
                                number
                                state
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
                                repository {
                                    name
                                    owner {
                                        login
                                    }
                                }
                                timelineItems(first: 20, itemTypes: [CONNECTED_EVENT, DISCONNECTED_EVENT]) {
                                    nodes {
                                        ... on ConnectedEvent {
                                            subject {
                                                ... on Issue {
                                                    id
                                                    title
                                                    url
                                                    number
                                                    state
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
                                                    repository {
                                                        name
                                                        owner {
                                                            login
                                                        }
                                                    }
                                                }
                                            }
                                        }
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

module.exports = {
    async receive(context) {

        const { projectItemId } = context.messages.in.content;

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
            throw new context.CancelError(`GraphQL errors: ${JSON.stringify(data.errors)}`);
        }

        const item = data.data.node;
        if (!item) {
            throw new context.CancelError(`Project item with ID '${projectItemId}' not found`);
        }

        // Process the item to add easier access to status and other fields
        const processedItem = {
            id: item.id,
            projectId: item?.project.id || null,
            content: null,
            fieldValues: [],
            status: null
        };

        // Process content with type information and flatten arrays
        if (item.content) {
            const contentType = item.content.__typename;
            processedItem.content = {
                ...item.content,
                type: contentType
            };
            // Remove the __typename field as it's now in type
            delete processedItem.content.__typename;

            // Process assignees and labels arrays
            if (processedItem.content.assignees?.nodes) {
                processedItem.content.assignees = processedItem.content.assignees.nodes;
            }
            if (processedItem.content.labels?.nodes) {
                processedItem.content.labels = processedItem.content.labels.nodes;
            }

            // Process linked PRs/Issues from timeline items
            if (processedItem.content.timelineItems?.nodes) {
                const connectedItems = [];
                processedItem.content.timelineItems.nodes.forEach(timelineItem => {
                    if (timelineItem.subject) {
                        const connectedItem = {
                            ...timelineItem.subject,
                            type: contentType === 'Issue' ? 'PullRequest' : 'Issue'
                        };

                        // Process assignees and labels for connected items
                        if (connectedItem.assignees?.nodes) {
                            connectedItem.assignees = connectedItem.assignees.nodes;
                        }
                        if (connectedItem.labels?.nodes) {
                            connectedItem.labels = connectedItem.labels.nodes;
                        }

                        connectedItems.push(connectedItem);
                    }
                });

                // Add connected items to the response
                if (contentType === 'Issue') {
                    processedItem.content.linkedPullRequests = connectedItems;
                } else if (contentType === 'PullRequest') {
                    processedItem.content.linkedIssues = connectedItems;
                }

                // Remove the timeline items as they're now processed
                delete processedItem.content.timelineItems;
            }
        }

        // Process field values with better value extraction
        const fieldNodes = item.fieldValues?.nodes || [];
        processedItem.fieldValues = fieldNodes.map(fv => {
            const fieldValue = {
                field: fv.field,
                value: fv.text || fv.name || fv.title || String(fv.number) || fv.date || null
            };
            return fieldValue;
        });

        // Find status field value for easier filtering
        const statusField = fieldNodes.find(fv =>
            fv.field && fv.field.name && fv.field.name.toLowerCase() === 'status'
        );

        if (statusField) {
            processedItem.status = statusField.name || statusField.text || statusField.title;
        }

        return context.sendJson(processedItem, 'out');
    }
};
