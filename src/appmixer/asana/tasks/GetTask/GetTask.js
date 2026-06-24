'use strict';
const commons = require('../../asana-commons');

/**
 * Component for fetching a single task by its ID (gid).
 * @extends {Component}
 */
module.exports = {

    receive(context) {

        const { taskId } = context.messages.in.content;
        if (!taskId) {
            throw new context.CancelError('Task ID is required');
        }

        const client = commons.getAsanaAPI(context.auth.accessToken);

        return client.tasks.findById(taskId)
            .then(task => context.sendJson(task, 'out'));
    }
};
