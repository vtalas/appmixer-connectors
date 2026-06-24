'use strict';
const commons = require('../../monday-commons');
const queries = require('../../queries');

/**
 * Component for moving an item to a different group on the same board.
 * @extends {Component}
 */
module.exports = {

    async receive(context) {

        const { itemId, groupId } = context.messages.in.content;

        if (!itemId) {
            throw new context.CancelError('Item ID is required');
        }
        if (!groupId) {
            throw new context.CancelError('Group ID is required');
        }

        const data = await commons.makeRequest({
            query: queries.MoveItemToGroup,
            options: {
                variables: {
                    itemId: +itemId,
                    groupId
                }
            },
            apiKey: context.auth.apiKey,
            context
        });

        await context.sendJson(data.move_item_to_group, 'out');
    }
};
