'use strict';
const lib = require('../../lib');

/**
 * Component for fetching a single GitHub Actions workflow by ID or file name.
 */
module.exports = {

    async receive(context) {

        const { repositoryId, workflowId } = context.properties;

        if (!workflowId) {
            throw new context.CancelError('Workflow ID is required!');
        }

        try {
            const { data } = await lib.apiRequest(
                context,
                `repos/${repositoryId}/actions/workflows/${encodeURIComponent(workflowId)}`
            );
            return context.sendJson(data, 'out');
        } catch (err) {
            if (err.response?.status === 404) {
                return context.sendJson({ repositoryId, workflowId }, 'notFound');
            }
            throw err;
        }
    }
};
