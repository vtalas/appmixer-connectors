'use strict';

module.exports = {

    async receive(context) {

        const { documentId } = context.messages.in.content;

        // Validate required input
        if (!documentId) {
            throw new context.CancelError('Document ID is required!');
        }

        // Get document content using Google Docs API
        // https://developers.google.com/docs/api/reference/rest/v1/documents/get
        const { data } = await context.httpRequest({
            method: 'GET',
            url: `https://docs.googleapis.com/v1/documents/${documentId}`,
            headers: {
                'Authorization': `Bearer ${context.auth.accessToken}`
            }
        });

        const out = {
            documentId: data.documentId,
            title: data.title,
            content: data.body.content
        };

        console.log('component output:', JSON.stringify(out));

        return context.sendJson(out, 'out');
    }
};
