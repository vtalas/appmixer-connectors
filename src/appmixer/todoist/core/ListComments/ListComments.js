'use strict';

const lib = require('../../lib');

module.exports = {

    async receive(context) {

        const { taskId, projectId, outputType } = context.messages.in.content;

        if (!taskId && !projectId) {
            throw new context.CancelError('Either Task ID or Project ID is required.');
        }

        const params = {};
        if (taskId) params.task_id = taskId;
        if (projectId) params.project_id = projectId;

        const comments = await lib.apiRequest(context, '/comments', { params });

        return lib.sendArrayOutput({
            context,
            outputType: outputType || 'array',
            records: comments,
            filesInfo: { filename: 'comments.json' }
        });
    }
};
