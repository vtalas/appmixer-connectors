'use strict';
const commons = require('../lib');

/**
 * Build opportunity update payload from provided fields only.
 * @param {Object} opportunity
 * @return {Object} opportunityObject
 */
function buildOpportunity(opportunity) {

    const opportunityObject = {};

    if (opportunity['name']) {
        opportunityObject['Name'] = opportunity['name'];
    }
    if (opportunity['stageName']) {
        opportunityObject['StageName'] = opportunity['stageName'];
    }
    if (opportunity['closeDate']) {
        opportunityObject['CloseDate'] = opportunity['closeDate'];
    }
    if (opportunity['accountId']) {
        opportunityObject['AccountId'] = opportunity['accountId'];
    }
    if (opportunity['amount'] !== undefined && opportunity['amount'] !== '') {
        opportunityObject['Amount'] = opportunity['amount'];
    }
    if (opportunity['probability'] !== undefined && opportunity['probability'] !== '') {
        opportunityObject['Probability'] = opportunity['probability'];
    }
    if (opportunity['type']) {
        opportunityObject['Type'] = opportunity['type'];
    }
    if (opportunity['leadSource']) {
        opportunityObject['LeadSource'] = opportunity['leadSource'];
    }
    if (opportunity['nextStep']) {
        opportunityObject['NextStep'] = opportunity['nextStep'];
    }
    if (opportunity['description']) {
        opportunityObject['Description'] = opportunity['description'];
    }

    return opportunityObject;
}

/**
 * Update an opportunity in Salesforce.
 * @extends {Component}
 */
module.exports = {

    receive(context) {

        const opportunity = context.messages.opportunity.content;

        if (!opportunity.opportunityId) {
            throw new context.CancelError('Opportunity ID is required');
        }

        const client = commons.getSalesforceAPI(context);
        const opportunityObject = buildOpportunity(opportunity);

        return client.sobject('Opportunity').update({ Id: opportunity.opportunityId, ...opportunityObject })
            .then(() => client.sobject('Opportunity').retrieve(opportunity.opportunityId))
            .then(result => context.sendJson(result, 'opportunity'));
    }
};
