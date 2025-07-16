'use strict';

const { camelCase } = require('lodash');
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
            'repository': {
                'type': 'object',
                'title': 'Repository',
                'properties': {
                    'name': { 'type': 'string', 'title': 'Repository Name' },
                    'owner': {
                        'type': 'object',
                        'title': 'Owner',
                        'properties': {
                            'login': { 'type': 'string', 'title': 'Owner Login' }
                        }
                    }
                }
            },
            'type': { 'type': 'string', 'title': 'Type' },
            'state': { 'type': 'string', 'title': 'State' },
            'assignees': {
                'type': 'array',
                'title': 'Assignees',
                'items': {
                    'type': 'object',
                    'properties': {
                        'login': { 'type': 'string', 'title': 'Login' }
                    }
                }
            },
            'labels': {
                'type': 'array',
                'title': 'Labels',
                'items': {
                    'type': 'object',
                    'properties': {
                        'name': { 'type': 'string', 'title': 'Name' }
                    }
                }
            }
        }
    },
    'fieldValues': {
        'type': 'array',
        'title': 'Field Values',
        'items': {
            'type': 'object',
            'properties': {
                'field': {
                    'type': 'object',
                    'title': 'Field',
                    'properties': {
                        'name': { 'type': 'string', 'title': 'Field Name' }
                    }
                },
                'value': { 'type': 'string', 'title': 'Value' }
            }
        }
    },
    'status': { 'type': 'string', 'title': 'Status' }
};

module.exports = {
    async receive(context) {
        const { projectId, status, contentType, outputType = 'array', generateOutputPortOptions } = context.messages.in.content;

        if (generateOutputPortOptions) {
            return lib.getOutputPortOptions(context, outputType, schema, { label: 'Items' });
        }

        const query = `
            query($projectId: ID!, $after: String) {
                node(id: $projectId) {
                    ... on ProjectV2 {
                        title
                        items(first: 100, after: $after) {
                            pageInfo {
                                hasNextPage
                                endCursor
                            }
                            nodes {
                                id
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
        let requestCount = 0;
        const maxRequests = 10; // Prevent infinite loops

        try {
            while (hasNextPage && requestCount < maxRequests) {
                requestCount++;
                
                const response = await context.httpRequest({
                    method: 'POST',
                    url: 'https://api.github.com/graphql',
                    headers: {
                        'Authorization': `Bearer ${context.auth.accessToken}`,
                        'Content-Type': 'application/json',
                        'User-Agent': 'Appmixer GitHub Connector'
                    },
                    data: {
                        query,
                        variables: { projectId, after: cursor }
                    }
                });

                if (response.data.errors) {
                    const errorMessages = response.data.errors.map(error => {
                        return `${error.message} (Path: ${error.path ? error.path.join('.') : 'unknown'})`;
                    }).join(', ');
                    throw new Error(`GitHub GraphQL API errors: ${errorMessages}`);
                }

                const project = response.data.data?.node;
                if (!project) {
                    throw new Error(`Project with ID '${projectId}' not found. Ensure the project ID is correct and you have 'read:project' permission. The project ID should start with 'PVTI_' for project items.`);
                }

                if (!project.items) {
                    throw new Error(`Unable to access items for project ${projectId}. This might be a permissions issue - ensure your token has 'read:project' scope.`);
                }

                const items = project.items.nodes || [];
                allItems = allItems.concat(items);

                hasNextPage = project.items.pageInfo.hasNextPage;
                cursor = project.items.pageInfo.endCursor;
            }

            if (requestCount >= maxRequests && context.log) {
                await context.log({ message: `Reached maximum request limit (${maxRequests}). Some items might be missing.` });
            }

            // Process items to add easier access to status and other fields
            const processedItems = allItems.map(item => {
                const processedItem = {
                    id: item.id,
                    content: null,
                    fieldValues: [],
                    status: null
                };

                // Process content with type information
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

                return processedItem;
            });

            // Filter by status if provided
            let filteredItems = processedItems;
            if (status) {
                filteredItems = filteredItems.filter(item =>
                    item.status && item.status.toLowerCase() === status.toLowerCase()
                );
            }

            // Filter by content type if provided
            if (contentType) {
                filteredItems = filteredItems.filter(item =>
                    item.content && item.content.type && item.content.type.toLowerCase() === contentType.toLowerCase()
                );
            }

            if (context.log) {
                await context.log({ 
                    message: `Retrieved ${allItems.length} items from project, ${filteredItems.length} items after filtering`,
                    projectId,
                    status,
                    contentType,
                    totalItems: allItems.length,
                    filteredItems: filteredItems.length
                });
            }

            if (filteredItems.length === 0) {
                return context.sendJson({}, 'notFound');
            }

            return lib.sendArrayOutput({ context, records: filteredItems, outputType });
            
        } catch (error) {
            // Enhanced error handling with more specific messages
            if (error.message.includes('Field \'items\' doesn\'t exist on type')) {
                throw new Error(`Invalid project ID format. The project ID should be a Project V2 ID (starting with 'PVTI_'), not a legacy project ID.`);
            }
            
            if (error.message.includes('rate limit')) {
                throw new Error(`GitHub API rate limit exceeded. Please try again later.`);
            }
            
            if (error.message.includes('401') || error.message.includes('Unauthorized')) {
                throw new Error(`Authentication failed. Please check your GitHub access token and ensure it has the 'read:project' scope.`);
            }
            
            if (error.message.includes('403') || error.message.includes('Forbidden')) {
                throw new Error(`Access denied. Ensure your token has 'read:project' scope and you have permission to access this project.`);
            }
            
            throw error;
        }
    }
};
