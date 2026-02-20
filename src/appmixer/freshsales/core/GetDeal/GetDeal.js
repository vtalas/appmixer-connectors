'use strict';

const api = require('../../api');

module.exports = {
    async receive(context) {

        const { id, include } = context.messages.in.content;

        if (!id) {
            throw new context.CancelError('Deal ID is required!');
        }

        const params = {};
        if (include) {
            params.include = include;
        }

        const { data } = await api.ViewDeal.execute(context, { id, ...params });

        return context.sendJson(data.deal, 'out');
    }
};
