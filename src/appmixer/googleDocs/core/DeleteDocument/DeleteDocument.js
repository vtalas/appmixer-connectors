'use strict';

module.exports = {
    async receive(context) {

        const { documentId } = context.messages.in.content;

        // Validate required input
        if (!documentId) {
            throw new context.CancelError('Document ID is required!');
        }

        // Use Google Drive API to delete the document
        // https://developers.google.com/drive/api/v3/reference/files/delete
        await context.httpRequest({
            method: 'DELETE',
            url: `https://www.googleapis.com/drive/v3/files/${documentId}`,
            headers: {
                'Authorization': `Bearer ${context.auth.accessToken}`
            }
        });

        return context.sendJson({ success: true }, 'out');
    }
};
