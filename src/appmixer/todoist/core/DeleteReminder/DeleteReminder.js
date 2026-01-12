'use strict';

const lib = require('../../lib');

module.exports = {

    async receive(context) {

        const { reminderId } = context.messages.in.content;

        if (!reminderId) {
            throw new context.CancelError('Reminder ID is required.');
        }

        const uuid = context.componentId + '-' + Date.now();

        await lib.syncApiRequest(context, [
            {
                type: 'reminder_delete',
                uuid,
                args: { id: reminderId }
            }
        ]);

        return context.sendJson({}, 'out');
    }
};
