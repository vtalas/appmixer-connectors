'use strict';

module.exports = {

    async receive(context) {

        const { id } = context.messages.in.content;

        if (!id) {
            throw new context.CancelError('Job ID is required!');
        }

        const { data } = await context.httpRequest({
            method: 'GET',
            url: `https://${context.domain}/api/job_statuses/${id}`,
            headers: {
                'Authorization': `Token token=${context.auth.apiKey}`,
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        });

        // Check if response is valid JSON object
        if (typeof data !== 'object' || data === null) {
            throw new context.CancelError('Invalid response from API. Expected JSON object.');
        }

        // Extract job_status from response if it exists, otherwise use data directly
        const jobStatus = data.job_status || data;

        return context.sendJson(jobStatus, 'out');
    }
};
