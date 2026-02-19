'use strict';

module.exports = {

    async receive(context) {

        const { id } = context.messages.in.content;

        if (!id) {
            throw new context.CancelError('Job ID is required!');
        }

        const { data } = await context.httpRequest({
            method: 'GET',
            url: `https://${context.auth.domain}.myfreshworks.com/crm/sales/api/job_statuses/${id}`,
            headers: {
                'Authorization': `Token token=${context.auth.apiKey}`,
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        });

        return context.sendJson(data, 'out');
    }
};
