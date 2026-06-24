'use strict';
const commons = require('../../trello-commons');

/**
 * Component for fetching a single card by ID.
 * @extends {Component}
 */
module.exports = {

    async receive(context) {

        const { boardCardId } = context.messages.in.content;

        if (!boardCardId) {
            throw new context.CancelError('Card is required');
        }

        try {
            const { data: card } = await context.httpRequest({
                headers: { 'Content-Type': 'application/json' },
                method: 'GET',
                url: `https://api.trello.com/1/cards/${boardCardId}?${commons.getAuthQueryParams(context)}`
            });
            return context.sendJson(card, 'card');
        } catch (err) {
            if (err.response?.status === 404) {
                return context.sendJson({ boardCardId }, 'notFound');
            }
            throw err;
        }
    }
};
