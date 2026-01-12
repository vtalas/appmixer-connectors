'use strict';

const lib = require('../../lib');

module.exports = {

    async receive(context) {

        const { projectId, outputType } = context.messages.in.content;

        const params = {};
        if (projectId) params.project_id = projectId;

        const sections = await lib.apiRequest(context, '/sections', { params });

        return lib.sendArrayOutput({
            context,
            outputType: outputType || 'array',
            records: sections,
            filesInfo: { filename: 'sections.json' }
        });
    }
};
