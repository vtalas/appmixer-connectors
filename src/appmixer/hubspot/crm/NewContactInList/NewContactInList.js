'use strict';
const Hubspot = require('../../Hubspot');
const { getObjectProperties } = require('../../commons');

// Default polling interval: 5 minutes
const DEFAULT_POLL_INTERVAL_MS = 5 * 60 * 1000;

module.exports = {

    async start(context) {

        // Store the current ISO timestamp as the start time.
        // On first poll we'll treat any members already in the list as already-seen.
        const now = new Date().toISOString();
        await context.saveState({ initializedAt: now, seenRecordIds: [] });
        return context.setTimeout({}, context.config?.pollIntervalMs || DEFAULT_POLL_INTERVAL_MS);
    },

    async stop(context) {
        // Nothing to clean up for a polling trigger.
    },

    async receive(context) {

        if (!context.messages.timeout) {
            return;
        }

        const hubspot = new Hubspot(context.auth.accessToken);
        const { listId, properties } = context.properties;
        const state = context.state || {};
        const seenRecordIds = new Set(state.seenRecordIds || []);
        const isFirstRun = !state.seenRecordIds;

        let propertiesToReturn;
        if (!properties) {
            propertiesToReturn = await getObjectProperties(context, hubspot, 'contacts', 'names');
        } else {
            propertiesToReturn = properties.split(',');
        }

        // Fetch all current list members via join-order endpoint (newest first).
        // We page through and collect IDs not yet seen.
        let newRecordIds = [];
        let after = undefined;

        try {
            do {
                const params = { limit: 100 };
                if (after) {
                    params.after = after;
                }
                const { data } = await hubspot.call(
                    'get',
                    `crm/v3/lists/${listId}/memberships/join-order`,
                    params
                );

                const results = data.results || [];
                after = data.paging?.next?.after;

                if (isFirstRun) {
                    // Seed the seen set with all current members — don't emit on first run.
                    results.forEach(r => seenRecordIds.add(String(r.recordId)));
                } else {
                    for (const record of results) {
                        const id = String(record.recordId);
                        if (!seenRecordIds.has(id)) {
                            newRecordIds.push(id);
                            seenRecordIds.add(id);
                        }
                    }
                }
            } while (after);
        } catch (err) {
            await context.log({ step: 'hubspot-new-contact-in-list-poll-error', listId, error: err.message });
            // Save state and reschedule even on error.
            await context.saveState({ seenRecordIds: Array.from(seenRecordIds) });
            return context.setTimeout({}, context.config?.pollIntervalMs || DEFAULT_POLL_INTERVAL_MS);
        }

        // Save updated seen set.
        await context.saveState({ seenRecordIds: Array.from(seenRecordIds) });

        // Fetch full contact data for new members.
        if (newRecordIds.length) {
            const { data } = await hubspot.call('post', 'crm/v3/objects/contacts/batch/read', {
                inputs: newRecordIds.map((id) => ({ id })),
                properties: propertiesToReturn
            });
            await context.sendArray(data.results, 'contact');
        }

        return context.setTimeout({}, context.config?.pollIntervalMs || DEFAULT_POLL_INTERVAL_MS);
    }
};
