'use strict';

const lib = require('../../lib.generated');

module.exports = {

    async receive(context) {

        const { file_id, ifMatch } = context.messages.in.content;

        if (!file_id) {
            throw new context.CancelError('File Id is required.');
        }

        const headers = {
            'Authorization': `Bearer ${context.auth.accessToken}`
        };

        if (ifMatch) {
            headers['If-Match'] = ifMatch;
        }

        // https://developer.box.com/reference/delete-files-id/
        await context.httpRequest({
            method: 'DELETE',
            url: `https://api.box.com/2.0/files/${file_id}`,
            headers
        });

        return context.sendJson({}, 'out');
    }
};
