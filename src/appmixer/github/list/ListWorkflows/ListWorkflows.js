'use strict';
const lib = require('../../lib');

/**
 * Component for listing GitHub Actions workflows in a repository.
 */
module.exports = {

    async receive(context) {

        const { repositoryId } = context.properties;
        const { data } = await lib.apiRequest(context, `repos/${repositoryId}/actions/workflows`);
        const workflows = data.workflows || [];

        return context.sendJson({ result: workflows, count: workflows.length }, 'out');
    }
};
