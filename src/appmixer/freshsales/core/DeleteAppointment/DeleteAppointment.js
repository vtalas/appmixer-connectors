'use strict';

module.exports = {

    async receive(context) {

        const { id } = context.messages.in.content;

        await context.httpRequest({
            method: 'DELETE',
            url: `https://${context.auth.domain}/api/appointments/${id}`,
            headers: {
                'Authorization': `Token token=${context.auth.apiKey}`,
                'Content-Type': 'application/json'
            }
        });

        return context.sendJson({ id, deleted: true }, 'out');
    }
};
