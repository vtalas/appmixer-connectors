module.exports = {
    async receive(context) {
        const { organizationLogin, limit = 20 } = context.messages.in.content || context.messages.in || {};

        try {
            let query;
            let variables;

            if (organizationLogin) {
                // List organization projects
                query = `
                    query($organization: String!, $limit: Int!) {
                        organization(login: $organization) {
                            projectsV2(first: $limit) {
                                totalCount
                                nodes {
                                    id
                                    title
                                    shortDescription
                                    url
                                    number
                                    public
                                    createdAt
                                    updatedAt
                                    owner {
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
                    }
                `;
                variables = { organization: organizationLogin, limit };
            } else {
                // List user projects - first get current user info
                const userResponse = await context.httpRequest({
                    method: 'GET',
                    url: 'https://api.github.com/user',
                    headers: {
                        'Authorization': `Bearer ${context.auth.accessToken}`,
                        'Accept': 'application/vnd.github.v3+json',
                        'User-Agent': 'Appmixer-GitHub-Projects-Connector'
                    }
                });

                if (!userResponse.data.login) {
                    throw new Error('Failed to get current user information');
                }

                query = `
                    query($user: String!, $limit: Int!) {
                        user(login: $user) {
                            projectsV2(first: $limit) {
                                totalCount
                                nodes {
                                    id
                                    title
                                    shortDescription
                                    url
                                    number
                                    public
                                    createdAt
                                    updatedAt
                                    owner {
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
                    }
                `;
                variables = { user: userResponse.data.login, limit };
            }

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
                    variables
                }
            });

            if (response.data.errors) {
                throw new Error(`GraphQL errors: ${JSON.stringify(response.data.errors)}`);
            }

            const projectsData = organizationLogin ?
                response.data.data.organization?.projectsV2 :
                response.data.data.user?.projectsV2;

            if (!projectsData) {
                throw new Error(organizationLogin ?
                    `Organization '${organizationLogin}' not found or no access` :
                    'User projects not found');
            }

            const projects = projectsData.nodes.map(project => ({
                id: project.id,
                title: project.title,
                shortDescription: project.shortDescription,
                url: project.url,
                number: project.number,
                owner: project.owner.login,
                public: project.public,
                createdAt: project.createdAt,
                updatedAt: project.updatedAt
            }));

            return context.sendJson({
                projects,
                totalCount: projectsData.totalCount
            }, 'out');

        } catch (error) {
            throw new Error(`Failed to list projects: ${error.message}`);
        }
    }
};