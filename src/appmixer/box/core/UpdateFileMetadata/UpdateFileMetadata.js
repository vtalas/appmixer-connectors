'use strict';

module.exports = {

    async receive(context) {

        const { file_id, scope, templateKey, op, path, value, from } = context.messages.in.content;

        if (!file_id) {
            throw new context.CancelError('File ID is required.');
        }

        if (!scope) {
            throw new context.CancelError('Scope is required.');
        }

        if (!templateKey) {
            throw new context.CancelError('Template Key is required.');
        }

        if (!op) {
            throw new context.CancelError('Operation is required.');
        }

        if (!path) {
            throw new context.CancelError('Path is required.');
        }

        // Build the JSON Patch operation
        const operation = {
            op,
            path
        };

        // Add optional fields based on operation type
        if (['add', 'replace', 'test'].includes(op) && value !== undefined) {
            operation.value = value;
        }

        if (['move', 'copy'].includes(op)) {
            if (!from) {
                throw new context.CancelError('From path is required for move/copy operations.');
            }
            operation.from = from;
        }

        // https://developer.box.com/reference/put-files-id-metadata-id-id/
        await context.httpRequest({
            method: 'PUT',
            url: `https://api.box.com/2.0/files/${file_id}/metadata/${scope}/${templateKey}`,
            headers: {
                'Authorization': `Bearer ${context.auth.accessToken}`,
                'Content-Type': 'application/json-patch+json'
            },
            data: [operation]
        });

        return context.sendJson({}, 'out');
    }
};
