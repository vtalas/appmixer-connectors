'use strict';

const lib = require('../../lib');

module.exports = {

    async receive(context) {

        const { projectId, outputType } = context.messages.in.content;

        if (!projectId) {
            throw new context.CancelError('Project ID is required.');
        }

        const collaborators = await lib.apiRequest(context, `/projects/${projectId}/collaborators`);

        return lib.sendArrayOutput({
            context,
            outputType: outputType || 'array',
            records: collaborators,
            filesInfo: { filename: 'collaborators.json' }
        });
    }
};
