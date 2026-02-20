'use strict';

const api = require('../../api');

module.exports = {
    async receive(context) {

        const { view_id, sort, sort_type, page } = context.messages.in.content;

        if (!view_id) {
            throw new context.CancelError('View ID is required! Use ListDealFilters to get available views.');
        }

        const params = {};
        if (sort) params.sort = sort;
        if (sort_type) params.sort_type = sort_type;
        if (page) params.page = page;

        const { data } = await api.ListAllDeals.execute(context, { view_id, ...params });

        return context.sendJson(data, 'out');
    }
};
