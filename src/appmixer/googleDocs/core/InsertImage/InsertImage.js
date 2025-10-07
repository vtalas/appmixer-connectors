'use strict';

module.exports = {

    async receive(context) {

        const { documentId, imageUrl, insertionIndex, width, height } = context.messages.in.content;

        // Validate required inputs
        if (!documentId) {
            throw new context.CancelError('Document ID is required.');
        }
        if (!imageUrl) {
            throw new context.CancelError('Image URL is required.');
        }

        // Use proper location structure for Google Docs API
        // If insertionIndex is provided, use it; otherwise default to index 1 (beginning of document)
        const location = insertionIndex !== undefined && insertionIndex !== null ? 
            { index: insertionIndex } : 
            { index: 1 };

        const imageRequest = {
            insertInlineImage: {
                location: location,
                uri: imageUrl
            }
        };

        // Add optional dimensions if provided
        if (width || height) {
            imageRequest.insertInlineImage.objectSize = {};
            if (width) {
                imageRequest.insertInlineImage.objectSize.width = {
                    magnitude: width,
                    unit: 'PT'
                };
            }
            if (height) {
                imageRequest.insertInlineImage.objectSize.height = {
                    magnitude: height,
                    unit: 'PT'
                };
            }
        }

        const requests = [imageRequest];

        // https://developers.google.com/docs/api/reference/rest/v1/documents/batchUpdate
        const { data } = await context.httpRequest({
            method: 'POST',
            url: `https://docs.googleapis.com/v1/documents/${documentId}:batchUpdate`,
            headers: {
                'Authorization': `Bearer ${context.auth.accessToken}`,
                'Content-Type': 'application/json'
            },
            data: { requests }
        });

        // Extract the objectId and insertionIndex from the response
        const reply = data.replies && data.replies[0] && data.replies[0].insertInlineImage;
        const objectId = reply ? reply.objectId : null;
        const actualInsertionIndex = reply ? reply.insertionIndex : null;

        return context.sendJson({
            documentId: documentId,
            imageUrl: imageUrl,
            objectId: objectId,
            insertionIndex: actualInsertionIndex,
            replies: data.replies
        }, 'out');
    }
};
