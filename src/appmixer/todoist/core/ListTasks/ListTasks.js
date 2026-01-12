'use strict';

const lib = require('../../lib');

module.exports = {

    async receive(context) {

        const { projectId, sectionId, labelId, filter, lang, ids, outputType } = context.messages.in.content;

        const params = {};

        if (projectId) params.project_id = projectId;
        if (sectionId) params.section_id = sectionId;
        if (labelId) params.label = labelId;
        if (filter) params.filter = filter;
        if (lang) params.lang = lang;
        if (ids) params.ids = ids;

        const tasks = await lib.apiRequest(context, '/tasks', { params });

        return lib.sendArrayOutput({
            context,
            outputType: outputType || 'array',
            records: tasks,
            filesInfo: { filename: 'tasks.json' }
        });
    }
};
