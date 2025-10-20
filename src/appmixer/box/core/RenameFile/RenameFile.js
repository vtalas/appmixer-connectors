'use strict';

const lib = require('../../lib.generated');

module.exports = {

    async receive(context) {

        const { file_id, name, ifMatch } = context.messages.in.content;

        // Validate required fields
        if (!file_id) {
            throw new context.CancelError('File Id is required!');
        }
        if (!name) {
            throw new context.CancelError('Name is required!');
        }

        const headers = {
            'Authorization': `Bearer ${context.auth.apiToken}`,
            'Content-Type': 'application/json'
        };

        // Add If-Match header if provided
        if (ifMatch) {
            headers['If-Match'] = ifMatch;
        }

        // https://developer.box.com/reference/put-files-id/
        await context.httpRequest({
            method: 'PUT',
            url: `https://api.box.com/2.0/files/${file_id}`,
            headers: headers,
            data: {
                name: name
            }
        });

        return context.sendJson({}, 'out');
    }
};
