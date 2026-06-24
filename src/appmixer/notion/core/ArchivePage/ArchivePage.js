'use strict';
const lib = require('../../lib');

module.exports = {
    async receive(context) {

        const { pageId, archived } = context.messages.in.content;

        if (!pageId) {
            throw new context.CancelError('Page ID is required.');
        }

        // Default to archiving when the toggle is not provided.
        const shouldArchive = archived === undefined ? true : archived;

        const response = await lib.callEndpoint(context, `/pages/${pageId}`, {
            method: 'PATCH',
            data: { archived: shouldArchive }
        });

        return context.sendJson(response.data, 'out');
    }
};
