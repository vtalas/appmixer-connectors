'use strict';

const commons = require('../commons');
const { makeRequest } = commons;

// According to the Graph API a calendarView window of 4 weeks is plenty to look ahead for
// upcoming events. Both tick() and test() use the same window/fetch so the emitted shape matches.
const LOOK_AHEAD_MS = 1000 * 60 * 60 * 24 * 7 * 4;

/**
 * Fetch the calendar view (recurring events expanded into single instances) ordered by start time
 * for the window [from, from + 4 weeks].
 * @param {Context} context
 * @param {Date} from
 * @return {Promise<Array>}
 */
async function fetchUpcomingEvents(context, from) {

    const { data } = await makeRequest(context, {
        method: 'GET',
        path: '/me/calendarView',
        params: {
            startDateTime: from.toISOString(),
            endDateTime: new Date(from.getTime() + LOOK_AHEAD_MS).toISOString(),
            '$orderby': 'start/dateTime',
            '$top': 100
        }
    });
    return (data && data.value) || [];
}

/**
 * Decide whether an event should fire in the current tick. Fires when the event start is in the
 * past (ongoing/just started) or falls within the current tick window, unless it was already
 * triggered and has not been modified since.
 * @param {Object} event
 * @param {Object} triggered
 * @param {number} tickPeriod
 * @return {boolean}
 */
function shouldTrigger(event, triggered, tickPeriod) {

    if (triggered[event.id] && triggered[event.id].lastModifiedDateTime === event.lastModifiedDateTime) {
        // Already triggered and nothing changed on the event record, do not fire again.
        return false;
    }

    const now = Date.now();
    // Graph calendarView returns start.dateTime in UTC (no offset), so append 'Z'.
    const eventStart = new Date(`${event.start.dateTime}Z`).getTime();

    // Start of the event is either in the past or somewhere between now and the next tick.
    return Math.max(eventStart - now, 0) < tickPeriod;
}

module.exports = {

    async tick(context) {

        const lastTick = context.messages.tick.content.lastTick
            ? new Date(context.messages.tick.content.lastTick)
            : new Date();
        const tickPeriod = context.messages.tick.content.elapsed || 60000;

        const triggered = context.state.triggered || {};

        const events = await fetchUpcomingEvents(context, lastTick);

        for (const event of events) {
            if (shouldTrigger(event, triggered, tickPeriod)) {
                triggered[event.id] = { lastModifiedDateTime: event.lastModifiedDateTime };
                await context.sendJson(event, 'out');
            }
        }

        return context.saveState({ triggered });
    },

    async test(context) {

        // Flow Test Mode: emit the soonest upcoming event without starting the flow. Uses the same
        // calendarView fetch and event shape as tick(), but skips the tick-window gating (which
        // suppresses output until an event is about to start) so a sample is always returned.
        const events = await fetchUpcomingEvents(context, new Date());
        const sample = events[0];
        if (!sample) {
            throw new Error('No upcoming events to use as test data.');
        }
        return context.sendJson(sample, 'out');
    }
};
