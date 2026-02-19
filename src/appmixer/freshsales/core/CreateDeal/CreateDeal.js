
'use strict';

const lib = require('../../lib');
module.exports = {
    async receive(context) {        

        const { deal|name, deal|amount, deal|currency_code, deal|expected_close, deal|stage_id, deal|owner_id, deal|custom_field, sales_account|id, sales_account|name, contacts_added_list, tags } = context.messages.in.content;


        // https://developers.freshworks.com/crm/api/
        const { data } = await context.httpRequest({
            method: 'POST',
            url: 'https://{bundleAlias}.myfreshworks.com/crm/sales/api/deals',
            headers: {
                'Authorization': `Bearer ${context.auth.apiToken}`
            }
        });
    

return context.sendJson(data, 'out');
    }
};
