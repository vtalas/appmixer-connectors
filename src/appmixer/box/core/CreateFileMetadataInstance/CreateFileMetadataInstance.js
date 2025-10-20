'use strict';

const lib = require('../../lib.generated');

module.exports = {

    async receive(context) {

        const { file_id, scope, templateKey, metadata } = context.messages.in.content;

        // Validate required inputs
        if (!file_id) {
            throw new context.CancelError('File Id is required.');
        }
        if (!scope) {
            throw new context.CancelError('Scope is required.');
        }
        if (!templateKey) {
            throw new context.CancelError('Template Key is required.');
        }
        if (!metadata) {
            throw new context.CancelError('Metadata is required.');
        }

        // Parse metadata if it's a string (from textarea input)
        let metadataObj = metadata;
        if (typeof metadata === 'string') {
            try {
                metadataObj = JSON.parse(metadata);
            } catch (error) {
                throw new context.CancelError('Metadata must be a valid JSON object.');
            }
        }

        // https://developer.box.com/reference/post-files-id-metadata-id-id/
        const { data } = await context.httpRequest({
            method: 'POST',
            url: `https://api.box.com/2.0/files/${file_id}/metadata/${scope}/${templateKey}`,
            headers: {
                'Authorization': `Bearer ${context.auth.apiToken}`,
                'Content-Type': 'application/json'
            },
            data: metadataObj
        });

        return context.sendJson(data, 'out');
    }
};
