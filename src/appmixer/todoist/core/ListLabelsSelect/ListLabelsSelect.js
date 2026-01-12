'use strict';

const lib = require('../../lib');

module.exports = {

    async receive(context) {

        const labels = await lib.apiRequest(context, '/labels');

        return context.sendJson(labels, 'out');
    }
};
