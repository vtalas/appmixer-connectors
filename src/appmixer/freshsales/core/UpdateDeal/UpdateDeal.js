'use strict';

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
            dealData.contacts_added_list = contacts_added_list
                .split(',')
                .map(i => parseInt(i.trim(), 10))
                .filter(i => !isNaN(i));
        }
        if (contacts_removed_list) {
            dealData.contacts_removed_list = contacts_removed_list
                .split(',')
                .map(i => parseInt(i.trim(), 10))
                .filter(i => !isNaN(i));
        }

        const { data } = await context.httpRequest({
            method: 'PUT',
            url: `https://${context.auth.domain}/api/deals/${id}`,
            headers: {
                'Authorization': `Token token=${context.auth.apiKey}`,
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            data: { deal: dealData }
        });

        return context.sendJson(data.deal, 'out');
    }
};
