'use strict';

const lib = require('../../lib.generated');

const schema = {
    'id': { 'type': 'string', 'title': 'ID' },
    'content': {
        'type': 'object',
        'title': 'Content',
        'properties': {
            'id': { 'type': 'string', 'title': 'Content ID' },
            'title': { 'type': 'string', 'title': 'Title' },
            'url': { 'type': 'string', 'title': 'URL' },
            'number': { 'type': 'number', 'title': 'Number' },
            'repository': { 'type': 'object', 'title': 'Repository' }
        }
    },
    'fieldValues': {
        'type': 'array',
        'title': 'Field Values',
        'items': {
            'type': 'object',
            'properties': {
                'field': { 'type': 'object', 'title': 'Field' },
                'value': { 'type': 'string', 'title': 'Value' }
            }
        }
    },
    'status': { 'type': 'string', 'title': 'Status' }
};

module.exports = {
    async receive(context) {
        const { projectId, status, outputType = 'array' } = context.messages.in.content;

        if (context.properties.generateOutputPortOptions) {
            return lib.getOutputPortOptions(context, outputType, schema, { label: 'Items' });
        }

        const query = `
            query($projectId: ID!, $after: String) {
                node(id: $projectId) {
                    ... on ProjectV2 {
                        items(first: 100, after: $after) {
                            pageInfo {
                                hasNextPage
                                endCursor
                            }
                            nodes {
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
                }
            }
        `;

        let allItems = [];
        let hasNextPage = true;
        let cursor = null;

        while (hasNextPage) {
            const { data } = await context.httpRequest({
                method: 'POST',
                url: 'https://api.github.com/graphql',
                headers: {
                    'Authorization': `Bearer ${context.auth.accessToken}`,
                    'Content-Type': 'application/json'
                },
                data: {
                    query,
                    variables: { projectId, after: cursor }
                }
            });

            if (data.errors) {
                throw new Error(`GraphQL errors: ${JSON.stringify(data.errors)}`);
            }

            const project = data.data.node;
            if (!project) {
                throw new Error(`Project with ID '${projectId}' not found`);
            }

            const items = project.items.nodes || [];
            allItems = allItems.concat(items);

            hasNextPage = project.items.pageInfo.hasNextPage;
            cursor = project.items.pageInfo.endCursor;
        }

        // Process items to add easier access to status and other fields
        const processedItems = allItems.map(item => {
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

            return processedItem;
        });

        // Filter by status if provided
        let filteredItems = processedItems;
        if (status) {
            filteredItems = processedItems.filter(item =>
                item.status && item.status.toLowerCase() === status.toLowerCase()
            );
        }

        return lib.sendArrayOutput({ context, records: filteredItems, outputType });
    }
};
