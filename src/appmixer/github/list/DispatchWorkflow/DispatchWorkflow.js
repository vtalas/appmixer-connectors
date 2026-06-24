'use strict';
const lib = require('../../lib');

/**
 * Component for triggering a GitHub Actions workflow via the workflow_dispatch event.
 */
module.exports = {

    async receive(context) {

        const { repositoryId, workflowId, ref, inputs } = context.properties;

        if (!workflowId) {
            throw new context.CancelError('Workflow ID is required!');
        }
        if (!ref) {
            throw new context.CancelError('Git Reference (branch or tag) is required!');
        }

        let parsedInputs;
        if (inputs) {
            try {
                parsedInputs = typeof inputs === 'object' ? inputs : JSON.parse(inputs);
            } catch (e) {
                throw new context.CancelError('Workflow Inputs must be valid JSON.');
            }
        }

        const body = { ref };
        if (parsedInputs && Object.keys(parsedInputs).length > 0) {
            body.inputs = parsedInputs;
        }

        // Returns 204 No Content on success.
        await lib.apiRequest(
            context,
            `repos/${repositoryId}/actions/workflows/${encodeURIComponent(workflowId)}/dispatches`,
            { method: 'POST', body }
        );

        return context.sendJson({ success: true, repositoryId, workflowId, ref }, 'out');
    }
};
