'use strict';
const commons = require('../../trello-commons');

/**
 * Component for creating a new list on a board.
 * @extends {Component}
 */
module.exports = {

    async receive(context) {

        const { boardId, name, position } = context.messages.in.content;

        if (!boardId) {
            throw new context.CancelError('Board is required');
        }
        if (!name || !name.trim()) {
            throw new context.CancelError('List name is required');
        }

        let url = `https://api.trello.com/1/lists?name=${encodeURIComponent(name.trim())}&idBoard=${boardId}&${commons.getAuthQueryParams(context)}`;
        if (position) {
            url += `&pos=${encodeURIComponent(position)}`;
        }

        const { data: list } = await context.httpRequest({
            headers: { 'Content-Type': 'application/json' },
            method: 'POST',
            url
        });

        return context.sendJson(list, 'list');
    }
};
