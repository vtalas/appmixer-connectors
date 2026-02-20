'use strict';

const api = require('../../api');

module.exports = {
    async receive(context) {
        const { filter, include } = context.messages.in.content;

        const params = {};
        if (filter) params.filter = filter;
        if (include) params.include = include;

        const { data } = await api.ListAllAppointments.execute(context, params);
        return context.sendJson(data, 'out');
    }
};
