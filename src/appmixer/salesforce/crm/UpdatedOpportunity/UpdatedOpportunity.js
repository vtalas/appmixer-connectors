'use strict';
const commons = require('../salesforce-commons');

/**
 * Component which triggers whenever new opportunity is added.
 * @extends {Component}
 */
module.exports = {

    async start(context) {
        // Use salesForceRq to fetch all Opportunity Id and StageName
        const { data } = await commons.api.salesForceRq(context, {
            method: 'GET',
            action: 'query?q=SELECT Id,StageName FROM Opportunity'
        });

        let knownStages = {};
        if (data && data.records) {
            data.records.forEach(opportunity => {
                knownStages[opportunity['Id']] = opportunity['StageName'];
            });
        }
        await context.saveState({ knownStages });
    },

    async tick(context) {
        let since = new Date();
        const targetStage = context.properties.stageName;

        const lastSince = context.state.since || since;

        const soql = `SELECT FIELDS(ALL) FROM Opportunity WHERE LastModifiedDate >= ${commons.Date.toDateTimeLiteral(lastSince)} LIMIT 200`;
        const { data } = await commons.api.salesForceRq(context, {
            action: `query?q=${encodeURIComponent(soql)}`,
            method: 'GET'
        });

        let res = (data && data.records) ? data.records : [];
        let knownStages = context.state.knownStages || {};
        context.log({ step: 'know stages', knownStages });

        context.log({ step: 'data', data });
        let newKnownStages = { ...knownStages };

        let triggered = [];
        if (res.length && targetStage) {
            res.forEach(opportunity => {
                const id = opportunity['Id'];
                const prevStage = knownStages[id];
                const currStage = opportunity['StageName'];

                // Only trigger if stage changed to targetStage
                if (currStage === targetStage && prevStage !== targetStage) {
                    triggered.push(opportunity);
                }
                // Update known stage
                newKnownStages[id] = currStage;
            });
        }
        await Promise.all(triggered.map(opportunity => {
            let dates = [
                'CloseDate',
                'CreatedDate',
                'LastModifiedDate',
                'LastViewedDate',
                'LastReferencedDate',
                'SystemModstamp'
            ];
            opportunity = commons.formatFields(opportunity, dates, commons.formatDate);
            return context.sendJson(opportunity, 'opportunity');
        }));
        await context.saveState({
            knownStages: newKnownStages,
            since: since
        });
    }
};
