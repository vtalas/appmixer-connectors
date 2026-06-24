'use strict';
const commons = require('../../asana-commons');

/**
 * Component for fetching a single project by its ID (gid).
 * @extends {Component}
 */
module.exports = {

    receive(context) {

        const { projectId } = context.messages.in.content;
        if (!projectId) {
            throw new context.CancelError('Project ID is required');
        }

        const client = commons.getAsanaAPI(context.auth.accessToken);

        return client.projects.findById(projectId)
            .then(project => context.sendJson(project, 'out'));
    }
};
