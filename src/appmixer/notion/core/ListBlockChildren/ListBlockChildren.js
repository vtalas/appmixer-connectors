'use strict';
const lib = require('../../lib');

module.exports = {
    async receive(context) {

        const { blockId } = context.messages.in.content;

        if (!blockId) {
            throw new context.CancelError('Block or Page ID is required.');
        }

        const blocks = [];
        let cursor;

        do {
            const response = await lib.callEndpoint(context, `/blocks/${blockId}/children`, {
                params: {
                    page_size: 100,
                    ...(cursor ? { start_cursor: cursor } : {})
                }
            });
            blocks.push(...(response.data.results || []));
            cursor = response.data.has_more ? response.data.next_cursor : null;
        } while (cursor);

        return context.sendJson({ blocks, count: blocks.length }, 'out');
    }
};
