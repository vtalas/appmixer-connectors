'use strict';

const api = require('../../api');

module.exports = {
    async receive(context) {

        const {
            id, name, amount, currency_code, expected_close,
            deal_stage_id, deal_pipeline_id, probability,
            owner_id, contacts_added_list, contacts_removed_list
        } = context.messages.in.content;

        if (!id) {
            throw new context.CancelError('Deal ID is required!');
        }

        const dealData = {
            name, amount, currency_code, expected_close,
            deal_stage_id, deal_pipeline_id, probability, owner_id
        };

        // Remove undefined/null/empty values
        Object.keys(dealData).forEach(key => {
            if (dealData[key] === undefined || dealData[key] === null || dealData[key] === '') {
                delete dealData[key];
            }
        });

        // Handle contact lists
        if (contacts_added_list) {
            dealData.contacts_added_list = typeof contacts_added_list === 'string'
                ? contacts_added_list.split(',').map(i => parseInt(i.trim(), 10)).filter(i => !isNaN(i))
                : contacts_added_list;
        }
        if (contacts_removed_list) {
            dealData.contacts_removed_list = typeof contacts_removed_list === 'string'
                ? contacts_removed_list.split(',').map(i => parseInt(i.trim(), 10)).filter(i => !isNaN(i))
                : contacts_removed_list;
        }

        const { data } = await api.UpdateDeal.execute(context, { id, deal: dealData });

        return context.sendJson(data.deal, 'out');
    }
};
