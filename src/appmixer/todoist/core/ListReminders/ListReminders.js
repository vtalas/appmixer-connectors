'use strict';

const lib = require('../../lib');

module.exports = {

    async receive(context) {

        const { outputType } = context.messages.in.content;

        // Use Sync API to get reminders
        const response = await context.httpRequest({
            method: 'POST',
            url: 'https://api.todoist.com/sync/v9/sync',
            headers: {
                'Authorization': `Bearer ${context.auth.accessToken}`,
                'Content-Type': 'application/json'
            },
            data: {
                sync_token: '*',
                resource_types: ['reminders']
            }
        });

        const reminders = response.data.reminders || [];

        return lib.sendArrayOutput({
            context,
            outputType: outputType || 'array',
            records: reminders,
            filesInfo: { filename: 'reminders.json' }
        });
    }
};
