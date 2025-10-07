'use strict';

module.exports = {

    async receive(context) {

        const { documentId, text, paragraphText, index, insertionIndex } = context.messages.in.content;

        // Validate required inputs
        if (!documentId) {
            throw new context.CancelError('Document ID is required.');
        }

        // Support both text/paragraphText and index/insertionIndex for compatibility
        const textToInsert = text || paragraphText;

        if (!textToInsert) {
            throw new context.CancelError('Paragraph text is required.');
        }

        const indexToUse = index !== undefined ? index : insertionIndex;

        let location;
        if (indexToUse !== undefined && indexToUse !== null) {
            // Use specific index if provided, ensure it's at least 1
            location = { index: Math.max(1, indexToUse) };
        } else {
            // When no index is provided, fetch document to determine end position
            const docResponse = await context.httpRequest({
                method: 'GET',
                url: `https://docs.googleapis.com/v1/documents/${documentId}`,
                headers: {
                    'Authorization': `Bearer ${context.auth.accessToken}`
                }
            });

            // Find the maximum endIndex from the document body content
            // The document body contains content elements, each with startIndex and endIndex
            // We want to insert at the end of the document (before the final newline)
            const bodyContent = docResponse.data.body.content || [];
            let maxEndIndex = 1;

            for (const element of bodyContent) {
                if (element.endIndex !== undefined) {
                    maxEndIndex = Math.max(maxEndIndex, element.endIndex);
                }
            }

            // Insert at the end, but before the final newline character
            // Google Docs documents always end with a newline at position (endIndex - 1)
            location = { index: Math.max(1, maxEndIndex - 1) };
        }

        const requests = [{
            insertText: {
                location: location,
                text: textToInsert + '\n' // Add newline to create a paragraph
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

        return context.sendJson({
            documentId: documentId,
            insertedText: textToInsert,
            replies: data.replies
        }, 'out');
    }
};
