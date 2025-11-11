
'use strict';

const lib = require('../../lib');
module.exports = {
    async receive(context) {        

        const { capture_id, amount|currency_code, amount|value, invoice_id, note_to_payer, paypal_request_id } = context.messages.in.content;


        // https://developer.paypal.com/docs/api/payments/v2/#captures_refund
        const { data } = await context.httpRequest({
            method: 'POST',
            url: 'https://api-m.sandbox.paypal.com/v2/payments/captures/{capture_id}/refund',
            headers: {
                'Authorization': `Bearer ${context.auth.apiToken}`
            }
        });
    

return context.sendJson(data, 'out');
    }
};
