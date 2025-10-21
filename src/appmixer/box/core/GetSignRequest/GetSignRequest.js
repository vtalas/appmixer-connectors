'use strict';

module.exports = {

    async receive(context) {

        const { sign_request_id } = context.messages.in.content;

        if (!sign_request_id) {
            throw new context.CancelError('Sign Request ID is required!');
        }

        // https://developer.box.com/reference/get-sign-requests-id/
        const { data } = await context.httpRequest({
            method: 'GET',
            url: `https://api.box.com/2.0/sign_requests/${sign_request_id}`,
            headers: {
                'Authorization': `Bearer ${context.auth.accessToken}`
            }
        });

        return context.sendJson(data, 'out');
    }
};
