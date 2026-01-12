'use strict';

const lib = require('../../lib');

module.exports = {

    async receive(context) {

        const { taskId, type, dueString, dueDatetime, minuteOffset } = context.messages.in.content;

        if (!taskId) {
            throw new context.CancelError('Task ID is required.');
        }

        const uuid = context.componentId + '-' + Date.now();
        const tempId = 'temp_' + Date.now();

        const args = {
            item_id: taskId,
            type
        };

        if (type === 'absolute') {
            if (dueString) {
                args.due = { string: dueString };
            } else if (dueDatetime) {
                args.due = { datetime: dueDatetime };
            }
        } else if (type === 'relative') {
            if (minuteOffset !== undefined) {
                args.minute_offset = minuteOffset;
            }
        }

        const response = await lib.syncApiRequest(context, [
            {
                type: 'reminder_add',
                uuid,
                temp_id: tempId,
                args
            }
        ]);

        const foundReminder = response.reminders?.find(r => r.item_id === taskId);
        const reminder = foundReminder || { id: response.temp_id_mapping?.[tempId] };

        return context.sendJson(reminder, 'out');
    }
};
