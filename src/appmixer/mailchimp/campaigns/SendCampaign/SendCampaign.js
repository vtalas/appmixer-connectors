'use strict';
const mailchimpDriver = require('../../commons');

/**
 * Send a Mailchimp campaign.
 * @extends {Component}
 */
module.exports = {

    async receive(context) {

        const { campaignId } = context.messages.in.content;

        if (!campaignId) {
            throw new context.CancelError('Campaign ID is required.');
        }

        // The send action returns 204 No Content on success.
        await mailchimpDriver.campaigns.sendCampaign(context, { campaignId });

        return context.sendJson({ campaignId }, 'out');
    }
};
