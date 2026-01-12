'use strict';

const lib = require('../../lib');

module.exports = {

    async receive(context) {

        const { projectId } = context.properties;

        const params = {};
        if (projectId) params.project_id = projectId;

        const sections = await lib.apiRequest(context, '/sections', { params });

        return context.sendJson(sections, 'out');
    }
};
