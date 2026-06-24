'use strict';
const commons = require('../../trello-commons');

/**
 * Component for adding a comment to a card.
 * @extends {Component}
 */
module.exports = {

    async receive(context) {

        const { boardCardId, text } = context.messages.in.content;

        if (!boardCardId) {
            throw new context.CancelError('Card is required');
        }
        if (!text) {
            throw new context.CancelError('Comment text is required');
        }

        const { data: comment } = await context.httpRequest({
            headers: { 'Content-Type': 'application/json' },
            method: 'POST',
            url: `https://api.trello.com/1/cards/${boardCardId}/actions/comments?text=${encodeURIComponent(text)}&${commons.getAuthQueryParams(context)}`
        });

        return context.sendJson(comment, 'comment');
    }
};
