'use strict';

module.exports = {

    campaignsToSelectArray({ campaigns }) {

        return (campaigns || []).map(campaign => ({
            label: campaign.name,
            value: campaign.campaignId
        }));
    }
};
