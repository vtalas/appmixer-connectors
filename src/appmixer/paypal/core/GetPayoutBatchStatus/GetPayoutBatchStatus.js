
'use strict';

const lib = require('../../lib');
const schema = { 'payout_item_id':{ 'type':'string','title':'Payout Item Id' },'transaction_id':{ 'type':'string','title':'Transaction Id' },'transaction_status':{ 'type':'string','title':'Transaction Status' },'payout_item':{ 'type':'object','properties':{ 'receiver':{ 'type':'string','title':'Payout Item.Receiver' },'amount':{ 'type':'object','properties':{ 'currency':{ 'type':'string','title':'Payout Item.Amount.Currency' },'value':{ 'type':'string','title':'Payout Item.Amount.Value' } },'title':'Payout Item.Amount' } },'title':'Payout Item' } };

module.exports = {
    async receive(context) {

        const { payout_batch_id, fields, page, page_size, total_required, outputType } = context.messages.in.content;

        if (context.properties.generateOutputPortOptions) {
            return lib.getOutputPortOptions(context, outputType, schema, { label: 'Items' });
        }

        // https://developer.paypal.com/docs/api/payments.payouts-batch/v1/#payouts_get
        const { data } = await context.httpRequest({
            method: 'GET',
            url: 'https://api-m.sandbox.paypal.com/v1/payments/payouts/{payout_batch_id}',
            headers: {
                'Authorization': `Bearer ${context.auth.apiToken}`
            }
        });

        return lib.sendArrayOutput({ context, records, outputType });
    }
};
