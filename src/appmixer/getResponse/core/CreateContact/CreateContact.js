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

        const { data, headers } = await lib.request(context, {
            method: 'POST',
            path: '/contacts',
            data: body
        });

        // The GetResponse API returns the contact ID in the Location header
        // Extract the contact ID from the Location header (e.g., /contacts/abc123)
        let contactId = null;
        const locationHeader = headers.location || headers.Location;
        if (locationHeader) {
            const match = locationHeader.match(/\/contacts\/([^/]+)$/);
            if (match) {
                contactId = match[1];
            }
        }

        // Build the response object
        const response = {
            email,
            ...data
        };

        if (contactId) {
            response.contactId = contactId;
        }

        if (name) {
            response.name = name;
        }

        if (scoring !== undefined && scoring !== null && scoring !== '') {
            response.scoring = parseInt(scoring, 10);
        }

        // If we have a contact ID, fetch the full contact details
        if (contactId) {
            try {
                const { data: contactData } = await lib.request(context, {
                    method: 'GET',
                    path: `/contacts/${contactId}`
                });
                return context.sendJson(contactData, 'out');
            } catch (error) {
                // If GET fails, return the constructed response
                return context.sendJson(response, 'out');
            }
        }

        // If no contact ID found, return the constructed response
        return context.sendJson(response, 'out');
    }
};
