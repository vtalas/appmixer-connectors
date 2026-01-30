'use strict';

const lib = require('../../lib');

module.exports = {

    async tick(context) {

        const { campaignId } = context.properties;

        // Get the last check time from state
        const state = await context.loadState();
        const lastCheck = state.lastCheck || new Date(0).toISOString();

        const params = {
            'query[createdOn][from]': lastCheck,
            'sort[createdOn]': 'asc'
        };

        if (campaignId) {
            params['query[campaignId]'] = campaignId;
        }

        const contacts = await lib.requestAllPages(context, {
            path: '/contacts',
            params,
            perPage: 100
        });

        if (contacts.length > 0) {
            // Update the last check time to the newest contact's creation time
            const newestContact = contacts[contacts.length - 1];
            const newLastCheck = newestContact.createdOn;

            // Only send contacts that are actually newer than the last check
            for (const contact of contacts) {
                // Skip contacts that were already processed (createdOn === lastCheck)
                if (contact.createdOn === lastCheck) {
                    continue;
                }
                await context.sendJson(contact, 'out');
            }

            // Save the new last check time
            await context.saveState({ lastCheck: newLastCheck });
        }
    }
};
