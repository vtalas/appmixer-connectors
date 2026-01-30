'use strict';

const lib = require('../../lib');

module.exports = {

    async tick(context) {

        const { campaignId } = context.properties;

        // Get the last check time from state
        const state = await context.loadState();
        const lastCheck = state.lastCheck || new Date(0).toISOString();

        const params = {
            'query[changedOn][from]': lastCheck,
            'sort[changedOn]': 'asc'
        };

        if (campaignId) {
            params['query[campaignId]'] = campaignId;
        }

        // GetResponse API endpoint for removed contacts
        // This fetches contacts that have been removed (unsubscribed) from campaigns
        try {
            const removedContacts = await lib.requestAllPages(context, {
                path: '/removed-contacts',
                params,
                perPage: 100
            });

            if (removedContacts.length > 0) {
                // Update the last check time to the newest contact's removal time
                const newestContact = removedContacts[removedContacts.length - 1];
                const newLastCheck = newestContact.changedOn || newestContact.removedOn;

                // Only send contacts that are actually newer than the last check
                for (const contact of removedContacts) {
                    const contactTime = contact.changedOn || contact.removedOn;
                    // Skip contacts that were already processed
                    if (contactTime === lastCheck) {
                        continue;
                    }
                    await context.sendJson(contact, 'out');
                }

                // Save the new last check time
                if (newLastCheck) {
                    await context.saveState({ lastCheck: newLastCheck });
                }
            }
        } catch (error) {
            // If the removed-contacts endpoint doesn't exist or returns an error,
            // log and continue (the endpoint may not be available for all accounts)
            if (error.response?.status === 404) {
                await context.log({
                    step: 'removed-contacts endpoint not available',
                    message: 'The removed-contacts endpoint may not be available for your GetResponse account type.'
                });
            } else {
                throw error;
            }
        }
    }
};
