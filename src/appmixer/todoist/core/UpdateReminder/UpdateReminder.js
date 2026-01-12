'use strict';

const lib = require('../../lib');

module.exports = {

    async receive(context) {

        const { reminderId, type, dueString, dueDatetime, minuteOffset } = context.messages.in.content;

        if (!reminderId) {
            throw new context.CancelError('Reminder ID is required.');
        }

        const uuid = context.componentId + '-' + Date.now();

        const args = { id: reminderId };

        if (type) args.type = type;

        if (type === 'absolute' || (!type && (dueString || dueDatetime))) {
            if (dueString) {
                args.due = { string: dueString };
            } else if (dueDatetime) {
                args.due = { datetime: dueDatetime };
            }
        }

        if (type === 'relative' || (!type && minuteOffset !== undefined)) {
            if (minuteOffset !== undefined) {
                args.minute_offset = minuteOffset;
            }
        }

        await lib.syncApiRequest(context, [
            {
                type: 'reminder_update',
                uuid,
                args
            }
        ]);

        return context.sendJson({}, 'out');
    }
};
