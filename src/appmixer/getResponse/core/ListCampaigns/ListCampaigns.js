'use strict';

const lib = require('../../lib');

module.exports = {

    async receive(context) {

        const campaigns = await lib.requestAllPages(context, {
            path: '/campaigns',
            perPage: 100
        });

        return context.sendJson({ campaigns }, 'out');
    },

    campaignsToSelectArray({ campaigns }) {

        return (campaigns || []).map(campaign => ({
            label: campaign.name,
            value: campaign.campaignId
        }));
    }
};
