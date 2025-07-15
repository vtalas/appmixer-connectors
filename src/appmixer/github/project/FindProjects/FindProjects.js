'use strict';

const lib = require('../../lib.generated');

const schema = {
    'id': { 'type': 'string', 'title': 'ID' },
    'number': { 'type': 'number', 'title': 'Number' },
    'title': { 'type': 'string', 'title': 'Title' },
    'shortDescription': { 'type': 'string', 'title': 'Short Description' },
    'readme': { 'type': 'string', 'title': 'Readme' },
    'url': { 'type': 'string', 'title': 'URL' },
    'createdAt': { 'type': 'string', 'title': 'Created At' },
    'updatedAt': { 'type': 'string', 'title': 'Updated At' },
    'closedAt': { 'type': 'string', 'title': 'Closed At' },
    'public': { 'type': 'boolean', 'title': 'Public' },
    'owner': { 'type': 'object', 'title': 'Owner' }
};

module.exports = {
    async receive(context) {
        const { owner, projectType = 'user', outputType = 'array' } = context.messages.in.content;

        if (context.properties.generateOutputPortOptions) {
            return lib.getOutputPortOptions(context, outputType, schema, { label: 'Projects', value: 'projects' });
        }

        const query = projectType === 'organization' ?
            `query($owner: String!) {
                organization(login: $owner) {
                    projectsV2(first: 100) {
                        nodes {
                            id
                            number
                            title
                            shortDescription
                            readme
                            url
                            createdAt
                            updatedAt
                            closedAt
                            public
                            owner {
                                __typename
                                ... on Organization {
                                    login
                                }
                                ... on User {
                                    login
                                }
                            }
                        }
                    }
                }
            }` :
            `query($owner: String!) {
                user(login: $owner) {
                    projectsV2(first: 100) {
                        nodes {
                            id
                            number
                            title
                            shortDescription
                            readme
                            url
                            createdAt
                            updatedAt
                            closedAt
                            public
                            owner {
                                __typename
                                ... on Organization {
                                    login
                                }
                                ... on User {
                                    login
                                }
                            }
                        }
                    }
                }
            }`;

        const { data } = await context.httpRequest({
            method: 'POST',
            url: 'https://api.github.com/graphql',
            headers: {
                'Authorization': `Bearer ${context.auth.accessToken}`,
                'Content-Type': 'application/json'
            },
            data: {
                query,
                variables: { owner }
            }
        });

        if (data.errors) {
            throw new Error(`GraphQL errors: ${JSON.stringify(data.errors)}`);
        }

        const entityData = projectType === 'organization' ? data.data.organization : data.data.user;
        if (!entityData) {
            throw new Error(`${projectType} '${owner}' not found`);
        }

        const projects = entityData.projectsV2.nodes || [];

        return lib.sendArrayOutput({ context, records: projects, outputType });
    }
};
