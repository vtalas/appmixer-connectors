
'use strict';

const lib = require('../../lib');
module.exports = {
    async receive(context) {        

        const { detail|invoice_number, detail|currency_code, detail|invoice_date, detail|payment_term|term_type, detail|payment_term|due_date, detail|note, detail|reference, invoicer|name|given_name, invoicer|name|surname, invoicer|email_address, invoicer|address|address_line_1, invoicer|address|admin_area_2, invoicer|address|postal_code, invoicer|address|country_code, primary_recipients|billing_info|name|full_name, primary_recipients|billing_info|email_address, primary_recipients|billing_info|address|address_line_1, primary_recipients|billing_info|address|admin_area_2, primary_recipients|billing_info|address|postal_code, primary_recipients|billing_info|address|country_code, items|name, items|quantity, items|unit_amount|currency_code, items|unit_amount|value, items|tax|name, items|tax|percent, items|discount|percent, items|discount|amount|currency_code, items|discount|amount|value, configuration|partial_payment|allow_partial_payment, configuration|partial_payment|minimum_amount_due|currency_code, configuration|partial_payment|minimum_amount_due|value, configuration|allow_tip } = context.messages.in.content;


        // https://developer.paypal.com/docs/api/invoicing/v2/#invoices_create
        const { data } = await context.httpRequest({
            method: 'POST',
            url: 'https://api-m.sandbox.paypal.com/v2/invoicing/invoices',
            headers: {
                'Authorization': `Bearer ${context.auth.apiToken}`
            }
        });
    

return context.sendJson(data, 'out');
    }
};
