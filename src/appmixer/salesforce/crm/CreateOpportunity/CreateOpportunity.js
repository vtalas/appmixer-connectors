'use strict';
const commons = require('../lib');

/**
 * Build opportunity.
 * @param {Object} opportunity
 * @return {Object} opportunityObject
 */
function buildOpportunity(opportunity) {

    const opportunityObject = {
        Name: opportunity.name,
        StageName: opportunity.stageName,
        CloseDate: opportunity.closeDate
    };

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
 * Create new opportunity in Salesforce.
 * @extends {Component}
 */
module.exports = {

    receive(context) {

        const opportunity = context.messages.opportunity.content;

        if (!opportunity.name) {
            throw new context.CancelError('Name is required');
        }
        if (!opportunity.stageName) {
            throw new context.CancelError('Stage is required');
        }
        if (!opportunity.closeDate) {
            throw new context.CancelError('Close Date is required');
        }

        const client = commons.getSalesforceAPI(context);
        const opportunityObject = buildOpportunity(opportunity);

        return client.sobject('Opportunity').create(opportunityObject)
            .then(result => client.sobject('Opportunity').retrieve(result['id']))
            .then(result => context.sendJson(result, 'newOpportunity'));
    }
};
