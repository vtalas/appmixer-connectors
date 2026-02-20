'use strict';

module.exports = {
    async receive(context) {
        const { filter, page, owner_id } = context.messages.in.content;

        const params = {};
        if (filter) params.filter = filter;
        if (page) params.page = page;
        if (owner_id) params.owner_id = owner_id;

        const { data } = await context.httpRequest({
            method: 'GET',
            url: `https://${context.auth.domain}/api/tasks`,
            headers: { 'Authorization': `Token token=${context.auth.apiKey}` },
            params
        });
        return context.sendJson(data, 'out');
    }
};
