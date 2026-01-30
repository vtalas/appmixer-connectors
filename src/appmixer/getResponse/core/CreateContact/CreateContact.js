'use strict';

const lib = require('../../lib');

module.exports = {

    async receive(context) {

        const {
            email,
            campaignId,
            name,
            dayOfCycle,
            scoring,
            ipAddress,
            tags
        } = context.messages.in.content;

        if (!email) {
            throw new context.CancelError('Email is required!');
        }

        if (!campaignId) {
            throw new context.CancelError('Campaign ID is required!');
        }

        const body = {
            email,
            campaign: {
                campaignId
            }
        };

        if (name) {
            body.name = name;
        }

        if (dayOfCycle !== undefined && dayOfCycle !== null && dayOfCycle !== '') {
            body.dayOfCycle = parseInt(dayOfCycle, 10);
        }

        if (scoring !== undefined && scoring !== null && scoring !== '') {
            body.scoring = parseInt(scoring, 10);
        }

        if (ipAddress) {
            body.ipAddress = ipAddress;
        }

        if (tags) {
            const tagIds = tags.split(',').map(t => t.trim()).filter(t => t);
            if (tagIds.length > 0) {
                body.tags = tagIds.map(tagId => ({ tagId }));
            }
        }

        const { data } = await lib.request(context, {
            method: 'POST',
            path: '/contacts',
            data: body
        });

        return context.sendJson(data, 'out');
    }
};
