
'use strict';

const lib = require('../../lib');
module.exports = {
    async receive(context) {        

        const { external_customer_id, external_id, plan_code, start_time, trial|days, trial|pricing|amount, trial|pricing|currency_code, charge_overrides|code, charge_overrides|amount, charge_overrides|currency_code } = context.messages.in.content;


        // https://docs.paypal.ai/reference/api/rest/subscriptions/create-a-new-subscription
        const { data } = await context.httpRequest({
            method: 'POST',
            url: 'https://api-m.sandbox.paypal.com/v1/commerce/billing/subscriptions',
            headers: {
                'Authorization': `Bearer ${context.auth.apiToken}`
            }
        });
    

return context.sendJson(data, 'out');
    }
};
