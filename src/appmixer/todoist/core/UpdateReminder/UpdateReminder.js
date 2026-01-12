'use strict';

const lib = require('../../lib');

module.exports = {

    async receive(context) {

        const { reminderId, type, dueString, dueDatetime, minuteOffset } = context.messages.in.content;

        if (!reminderId) {
            throw new context.CancelError('Reminder ID is required.');
        }

        const data = {};

        if (type) {
            data.type = type;
        }

        // Handle absolute reminders with due date
        if (type === 'absolute' || (!type && (dueString || dueDatetime))) {
            data.due = {};
            if (dueString) {
                data.due.string = dueString;
            } else if (dueDatetime) {
                data.due.datetime = dueDatetime;
            }
        }

        // Handle relative reminders with minute offset
        if (type === 'relative' || (!type && minuteOffset !== undefined)) {
            if (minuteOffset !== undefined) {
                data.minute_offset = minuteOffset;
            }
        }

        await lib.apiRequest(context, `/reminders/${reminderId}`, {
            method: 'POST',
            data
        });

        return context.sendJson({}, 'out');
    }
};
