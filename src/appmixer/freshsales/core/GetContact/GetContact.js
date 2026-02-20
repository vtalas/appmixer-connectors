'use strict';

const api = require('../../api');

module.exports = {
    async receive(context) {

        const { id, include } = context.messages.in.content;

        if (!id) {
            throw new context.CancelError('Contact ID is required!');
        }

        const params = {};
        if (include) {
            params.include = include;
        }

        const { data } = await api.GetContact.execute(context, { id, ...params });

        return context.sendJson(data.contact, 'out');
    }
};
