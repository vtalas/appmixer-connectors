'use strict';
const lib = require('../../lib');

module.exports = {
    async receive(context) {

        const { blockId, content, children } = context.messages.in.content;

        if (!blockId) {
            throw new context.CancelError('Block or Page ID is required.');
        }

        let blocks;
        if (children) {
            try {
                blocks = typeof children === 'object' ? children : JSON.parse(children);
            } catch (e) {
                throw new context.CancelError('Children must be a valid JSON array of Notion block objects.');
            }
            if (!Array.isArray(blocks)) {
                throw new context.CancelError('Children must be a JSON array of Notion block objects.');
            }
        } else if (content) {
            // Turn each non-empty line of plain text into a paragraph block.
            blocks = content.split('\n').map(line => ({
                object: 'block',
                type: 'paragraph',
                paragraph: {
                    rich_text: [{ type: 'text', text: { content: line } }]
                }
            }));
        } else {
            throw new context.CancelError('Provide either Content or Children to append.');
        }

        const response = await lib.callEndpoint(context, `/blocks/${blockId}/children`, {
            method: 'PATCH',
            data: { children: blocks }
        });

        return context.sendJson(response.data, 'out');
    }
};
