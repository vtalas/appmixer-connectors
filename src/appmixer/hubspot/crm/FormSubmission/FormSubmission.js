'use strict';
const Hubspot = require('../../Hubspot');

// Default polling interval: 5 minutes
const DEFAULT_POLL_INTERVAL_MS = 5 * 60 * 1000;

module.exports = {

    async start(context) {

        // Store the current timestamp as the baseline. On first poll we'll seed the
        // last-seen submission time to now and not emit historical submissions.
        const now = Date.now();
        await context.saveState({ lastSeenAt: now, isFirstRun: true });
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
        const { formId } = context.properties;
        const state = context.state || {};
        const lastSeenAt = state.lastSeenAt || Date.now();
        const isFirstRun = state.isFirstRun === true;

        let newLastSeenAt = lastSeenAt;
        let newSubmissions = [];

        try {
            // Fetch recent submissions. HubSpot returns results newest first.
            // We paginate until we reach submissions older than lastSeenAt.
            let after = undefined;
            let done = false;

            do {
                const params = { limit: 50 };
                if (after) {
                    params.after = after;
                }

                const { data } = await hubspot.call(
                    'get',
                    `form-integrations/v1/submissions/by-form/${formId}`,
                    params
                );

                const results = data.results || [];
                after = data.paging?.next?.after;

                for (const submission of results) {
                    const submittedAt = submission.submittedAt || 0;
                    if (submittedAt > lastSeenAt) {
                        if (!isFirstRun) {
                            newSubmissions.push(submission);
                        }
                        if (submittedAt > newLastSeenAt) {
                            newLastSeenAt = submittedAt;
                        }
                    } else {
                        // Submissions are ordered newest first; once we hit an old one we're done.
                        done = true;
                        break;
                    }
                }

                if (!results.length) {
                    done = true;
                }
            } while (after && !done);

        } catch (err) {
            await context.log({ step: 'hubspot-form-submission-poll-error', formId, error: err.message });
            // Reschedule even on error.
            return context.setTimeout({}, context.config?.pollIntervalMs || DEFAULT_POLL_INTERVAL_MS);
        }

        // Update state with new last seen timestamp.
        await context.saveState({ lastSeenAt: newLastSeenAt, isFirstRun: false });

        if (newSubmissions.length) {
            // Emit oldest first so downstream components process in chronological order.
            await context.sendArray(newSubmissions.reverse(), 'submission');
        }

        return context.setTimeout({}, context.config?.pollIntervalMs || DEFAULT_POLL_INTERVAL_MS);
    }
};
