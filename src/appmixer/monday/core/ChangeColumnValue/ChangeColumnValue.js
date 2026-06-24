'use strict';
const commons = require('../../monday-commons');
const queries = require('../../queries');

/**
 * Component for changing one or more column values of an item.
 * @extends {Component}
 */
module.exports = {

    async receive(context) {

        const { boardId, itemId, columnValues, createLabelsIfMissing } = context.messages.in.content;

        if (!boardId) {
            throw new context.CancelError('Board ID is required');
        }
        if (!itemId) {
            throw new context.CancelError('Item ID is required');
        }
        if (!columnValues) {
            throw new context.CancelError('Column Values are required');
        }

        let parsed;
        try {
            parsed = typeof columnValues === 'object' ? columnValues : JSON.parse(columnValues);
        } catch (e) {
            throw new context.CancelError('Column Values must be a valid JSON object.');
        }

        const data = await commons.makeRequest({
            query: queries.ChangeColumnValues,
            options: {
                variables: {
                    boardId: +boardId,
                    itemId: +itemId,
                    columnValues: JSON.stringify(parsed),
                    createLabelsIfMissing
                }
            },
            apiKey: context.auth.apiKey,
            context
        });

        await context.sendJson(data.change_multiple_column_values, 'out');
    }
};
