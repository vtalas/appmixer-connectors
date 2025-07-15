module.exports = {
    async receive(context) {
        const { projectId, contentId } = context.messages.in.content || context.messages.in || {};

        if (!projectId || !contentId) {
            throw new Error('Project ID and Content ID are required');
        }

        try {
            const mutation = `
                mutation($projectId: ID!, $contentId: ID!) {
                    addProjectV2ItemById(input: {
                        projectId: $projectId
                        contentId: $contentId
                    }) {
                        item {
                            id
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
                    query: mutation,
                    variables: { projectId, contentId }
                }
            });

            if (response.data.errors) {
                throw new Error(`GraphQL errors: ${JSON.stringify(response.data.errors)}`);
            }

            const result = response.data.data.addProjectV2ItemById;
            if (!result?.item?.id) {
                throw new Error('Failed to add item to project');
            }

            return context.sendJson({
                itemId: result.item.id,
                success: true
            }, 'out');

        } catch (error) {
            throw new Error(`Failed to add project item: ${error.message}`);
        }
    }
};