'use strict';
const commons = require('../lib');

/**
 * Add a contact or lead to a campaign (creates a CampaignMember).
 * @extends {Component}
 */
module.exports = {

    receive(context) {

        const { campaignId, contactId, leadId, status } = context.messages.in.content;

        if (!campaignId) {
            throw new context.CancelError('Campaign ID is required');
        }
        if (!contactId && !leadId) {
            throw new context.CancelError('Either Contact ID or Lead ID is required');
        }

        const member = { CampaignId: campaignId };
        if (contactId) {
            member.ContactId = contactId;
        }
        if (leadId) {
            member.LeadId = leadId;
        }
        if (status) {
            member.Status = status;
        }

        const client = commons.getSalesforceAPI(context);

        return client.sobject('CampaignMember').create(member)
            .then(result => client.sobject('CampaignMember').retrieve(result['id']))
            .then(result => context.sendJson(result, 'out'));
    }
};
