
'use strict';

const lib = require('../../lib');
const schema = { 'id':{ 'type':'string','title':'Id' },'external_id':{ 'type':'string','title':'External Id' },'external_customer_id':{ 'type':'string','title':'External Customer Id' },'plan_code':{ 'type':'string','title':'Plan Code' },'status':{ 'type':'string','title':'Status' },'create_time':{ 'type':'string','title':'Create Time' } };

module.exports = {
    async receive(context) {

        const { page, per_page, external_customer_id, plan_code, status, outputType } = context.messages.in.content;

        if (context.properties.generateOutputPortOptions) {
            return lib.getOutputPortOptions(context, outputType, schema, { label: 'Items' });
        }

        // https://docs.paypal.ai/reference/api/rest/subscriptions/get-all-subscriptions
        const { data } = await context.httpRequest({
            method: 'GET',
            url: 'https://api-m.sandbox.paypal.com/v1/commerce/billing/subscriptions',
            headers: {
                'Authorization': `Bearer ${context.auth.apiToken}`
            }
        });

        return lib.sendArrayOutput({ context, records, outputType });
    }
};
