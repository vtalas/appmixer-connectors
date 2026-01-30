'use strict';

const lib = require('../../lib');

module.exports = {

    async receive(context) {

        const {
            contactId,
            name,
            campaignId,
            dayOfCycle,
            scoring,
            tags
        } = context.messages.in.content;

        if (!contactId) {
            throw new context.CancelError('Contact ID is required!');
        }

        const body = {};

        if (name !== undefined && name !== null && name !== '') {
            body.name = name;
        }

        if (campaignId) {
            body.campaign = {
                campaignId
            };
        }

        if (dayOfCycle !== undefined && dayOfCycle !== null && dayOfCycle !== '') {
            body.dayOfCycle = parseInt(dayOfCycle, 10);
        }

        if (scoring !== undefined && scoring !== null && scoring !== '') {
            body.scoring = parseInt(scoring, 10);
        }

        if (tags !== undefined && tags !== null && tags !== '') {
            const tagIds = tags.split(',').map(t => t.trim()).filter(t => t);
            if (tagIds.length > 0) {
                body.tags = tagIds.map(tagId => ({ tagId }));
            }
        }

        await lib.request(context, {
            method: 'POST',
            path: `/contacts/${contactId}`,
            data: body
        });

        return context.sendJson({}, 'out');
    }
};
