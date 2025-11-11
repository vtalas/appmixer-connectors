
'use strict';

const lib = require('../../lib');
module.exports = {
    async receive(context) {        

        const { sender_batch_header|sender_batch_id, sender_batch_header|email_subject, sender_batch_header|email_message, items|recipient_type, items|receiver, items|amount|currency, items|amount|value, items|note, items|sender_item_id } = context.messages.in.content;


        // https://developer.paypal.com/docs/api/payments.payouts-batch/v1/#payouts_post
        const { data } = await context.httpRequest({
            method: 'POST',
            url: 'https://api-m.sandbox.paypal.com/v1/payments/payouts',
            headers: {
                'Authorization': `Bearer ${context.auth.apiToken}`
            }
        });
    

return context.sendJson(data, 'out');
    }
};
