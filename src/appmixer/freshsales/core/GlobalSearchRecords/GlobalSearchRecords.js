'use strict';

module.exports = {
    async receive(context) {

        const { q, entity_type, page, per_page } = context.messages.in.content;

        if (!q) {
            throw new context.CancelError('Search query (q) is required!');
        }

        const url = `https://${context.auth.domain}/api/search/global`;
        const params = {
            q
        };

        if (entity_type) {
            params.entity_type = entity_type;
        }

        if (page) {
            params.page = page;
        }

        if (per_page) {
            params.per_page = per_page;
        }

        const response = await context.httpRequest({
            method: 'GET',
            url,
            params,
            headers: {
                'Authorization': `Token token=${context.auth.apiKey}`,
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        });

        const { results, meta } = response.data;

        return context.sendJson({
            results: results || [],
            meta: meta || {}
        }, 'out');
    }
};
