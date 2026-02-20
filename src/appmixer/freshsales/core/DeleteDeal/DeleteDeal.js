'use strict';

const api = require('../../api');

module.exports = {
    async receive(context) {

        const { id } = context.messages.in.content;

        if (!id) {
            throw new context.CancelError('Deal ID is required!');
        }

        await api.DeleteDeal.execute(context, { id });

        return context.sendJson({ id, deleted: true }, 'out');
    }
};
