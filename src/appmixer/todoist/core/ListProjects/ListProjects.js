'use strict';

const lib = require('../../lib');

module.exports = {

    async receive(context) {

        const { outputType } = context.messages.in.content;

        const projects = await lib.apiRequest(context, '/projects');

        return lib.sendArrayOutput({
            context,
            outputType: outputType || 'array',
            records: projects,
            filesInfo: { filename: 'projects.json' }
        });
    }
};
