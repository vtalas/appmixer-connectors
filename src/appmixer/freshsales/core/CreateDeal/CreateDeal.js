'use strict';

module.exports = {

    async receive(context) {

        const {
            deal_name,
            deal_amount,
            currency_code,
            expected_close,
            stage_id,
            owner_id,
            sales_account_id,
            sales_account_name,
            contacts_list,
            tags,
            custom_fields
        } = context.messages.in.content;

        // Validate required inputs
        if (!deal_name) {
            throw new context.CancelError('Deal Name is required!');
        }

        if (!deal_amount) {
            throw new context.CancelError('Deal Amount is required!');
        }

        // Build the deal object
        const dealData = {
            deal: {
                name: deal_name,
                amount: deal_amount
            }
        };

        // Add optional fields
        if (currency_code) {
            dealData.deal.currency_code = currency_code;
        }

        if (expected_close) {
            dealData.deal.expected_close = expected_close;
        }

        if (stage_id) {
            dealData.deal.deal_stage_id = stage_id;
        }

        if (owner_id) {
            dealData.deal.owner_id = owner_id;
        }

        if (sales_account_id) {
            dealData.deal.sales_account_id = sales_account_id;
        }

        if (sales_account_name) {
            dealData.deal.sales_account = {
                name: sales_account_name
            };
        }

        if (contacts_list) {
            const contactsArray = typeof contacts_list === 'string'
                ? contacts_list.split(',').map(id => parseInt(id.trim(), 10)).filter(id => !isNaN(id))
                : Array.isArray(contacts_list) ? contacts_list : [];
            if (contactsArray.length > 0) {
                dealData.deal.contacts_added_list = contactsArray;
            }
        }

        if (tags) {
            const tagsArray = typeof tags === 'string'
                ? tags.split(',').map(tag => tag.trim()).filter(tag => tag)
                : Array.isArray(tags) ? tags : [];
            if (tagsArray.length > 0) {
                dealData.deal.tags = tagsArray;
            }
        }

        if (custom_fields && typeof custom_fields === 'object') {
            dealData.deal.custom_field = custom_fields;
        }

        // Make the API request with correct authentication and domain
        const { data } = await context.httpRequest({
            method: 'POST',
            url: `https://${context.auth.domain}/api/deals`,
            headers: {
                'Authorization': `Token token=${context.auth.apiKey}`,
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            data: dealData
        });

        return context.sendJson(data.deal, 'out');
    }
};
