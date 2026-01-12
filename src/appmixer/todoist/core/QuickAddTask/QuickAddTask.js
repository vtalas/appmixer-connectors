'use strict';

module.exports = {

    async receive(context) {

        const { text, note, reminder, autoReminder } = context.messages.in.content;

        const body = { text };

        if (note) body.note = note;
        if (reminder) body.reminder = reminder;
        if (autoReminder !== undefined) body.auto_reminder = autoReminder;

        const response = await context.httpRequest({
            method: 'POST',
            url: 'https://api.todoist.com/sync/v9/quick/add',
            headers: {
                'Authorization': `Bearer ${context.auth.accessToken}`,
                'Content-Type': 'application/json'
            },
            data: body
        });

        return context.sendJson(response.data, 'out');
    }
};
