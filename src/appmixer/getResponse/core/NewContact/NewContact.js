'use strict';

const lib = require('../../lib');

module.exports = {

    async tick(context) {

        const { campaignId } = context.properties;

        let lock;
        try {
            lock = await context.lock(context.componentId, {
                ttl: 5 * 60 * 1000,
                maxRetryCount: 0
            });
        } catch (e) {
            // Another tick is already running, skip this one
            return;
        }

        try {
            // Get the last check time from state
            const state = await context.loadState() || {};
            const lastCheck = state.lastCheck ? new Date(state.lastCheck) : new Date(0);

            const params = {
                'query[createdOn][from]': lastCheck.toISOString(),
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
                // Track which contacts are new
                const known = state.known ? new Set(state.known) : new Set();
                const newContactIds = [];
                const contactsToSend = [];

                for (const contact of contacts) {
                    if (!known.has(contact.contactId)) {
                        contactsToSend.push(contact);
                        newContactIds.push(contact.contactId);
                        known.add(contact.contactId);
                    }
                }

                // Send new contacts
                for (const contact of contactsToSend) {
                    await context.sendJson(contact, 'out');
                }

                // Update the last check time and known contacts
                const newestContact = contacts[contacts.length - 1];
                await context.saveState({
                    lastCheck: newestContact.createdOn,
                    known: Array.from(known)
                });
            }
        } finally {
            if (lock) {
                await lock.unlock();
            }
        }
    }
};
