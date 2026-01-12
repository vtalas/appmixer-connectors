'use strict';

const lib = require('../../lib');

module.exports = {

    async receive(context) {

        const projects = await lib.apiRequest(context, '/projects');

        return context.sendJson(projects, 'out');
    }
};
