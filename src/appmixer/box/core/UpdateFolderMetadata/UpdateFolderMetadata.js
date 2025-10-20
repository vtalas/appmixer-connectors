'use strict';

module.exports = {

    async receive(context) {

        const { folderId, scope, templateKey, op, path, value, from } = context.messages.in.content;

        // Validate required inputs
        if (!folderId) {
            throw new context.CancelError('Folder ID is required.');
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

        // Build the operation object
        const operation = {
            op,
            path
        };

        // Add value for operations that require it
        if (['add', 'replace', 'test'].includes(op)) {
            if (!value) {
                throw new context.CancelError(`Value is required for ${op} operation.`);
            }
            operation.value = value;
        }

        // Add from for operations that require it
        if (['move', 'copy'].includes(op)) {
            if (!from) {
                throw new context.CancelError(`From is required for ${op} operation.`);
            }
            operation.from = from;
        }

        // https://developer.box.com/reference/put-folders-id-metadata-id-id/
        await context.httpRequest({
            method: 'PUT',
            url: `https://api.box.com/2.0/folders/${folderId}/metadata/${scope}/${templateKey}`,
            headers: {
                'Authorization': `Bearer ${context.auth.accessToken}`,
                'Content-Type': 'application/json-patch+json'
            },
            data: [operation]
        });

        return context.sendJson({}, 'out');
    }
};
