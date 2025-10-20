'use strict';

module.exports = {

    async receive(context) {

        const { folder_id, scope, templateKey, metadata } = context.messages.in.content;

        // Validate required inputs
        if (!folder_id) {
            throw new context.CancelError('Folder Id is required.');
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

        // Parse metadata if it's a string
        let metadataObj = metadata;
        if (typeof metadata === 'string') {
            try {
                metadataObj = JSON.parse(metadata);
            } catch (err) {
                throw new context.CancelError('Invalid JSON format for Metadata.');
            }
        }

        // https://developer.box.com/reference/post-folders-id-metadata-id-id/
        const { data } = await context.httpRequest({
            method: 'POST',
            url: `https://api.box.com/2.0/folders/${folder_id}/metadata/${scope}/${templateKey}`,
            headers: {
                'Authorization': `Bearer ${context.auth.accessToken}`,
                'Content-Type': 'application/json'
            },
            data: metadataObj
        });

        return context.sendJson(data, 'out');
    }
};
