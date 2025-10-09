'use strict';

module.exports = {

    async receive(context) {

        const { documentId, targetImageId, newImageUrl } = context.messages.in.content;

        // Validate required inputs
        if (!documentId) {
            throw new context.CancelError('Document Id is required!');
        }
        if (!targetImageId) {
            throw new context.CancelError('Target Image Id is required!');
        }
        if (!newImageUrl) {
            throw new context.CancelError('New Image Url is required!');
        }

        const requests = [{
            replaceImage: {
                imageObjectId: targetImageId,
                uri: newImageUrl
            }
        }];

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

        return context.sendJson(data, 'out');
    }
};
