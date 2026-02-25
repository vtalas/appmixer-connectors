'use strict';

module.exports = {
    async receive(context) {

        const { id, include } = context.messages.in.content;

        const params = {};
        if (include) {
            params.include = include;
        }

        const queryString = Object.keys(params).length
            ? '?' + new URLSearchParams(params).toString()
            : '';

        const { data } = await context.httpRequest({
            method: 'GET',
            url: `https://${context.auth.domain}/api/deals/${id}${queryString}`,
            headers: {
                'Authorization': `Token token=${context.auth.apiKey}`,
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        });

        return context.sendJson(data.deal, 'out');
    }
};
