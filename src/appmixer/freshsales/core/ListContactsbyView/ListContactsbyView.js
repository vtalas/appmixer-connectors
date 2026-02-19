'use strict';

const api = require('../../api');

module.exports = {

    async receive(context) {

        const { view_id, sort, sort_type } = context.messages.in.content;

        if (!view_id) {
            throw new context.CancelError('View ID is required!');
        }

        const result = await api.ListContactsByView.execute(context, {
            view_id,
            sort,
            sort_type
        });

        return context.sendJson(result, 'out');
    }
};
