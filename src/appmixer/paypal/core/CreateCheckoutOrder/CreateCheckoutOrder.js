
'use strict';

const lib = require('../../lib');
module.exports = {
    async receive(context) {        

        const { intent, purchase_units|reference_id, purchase_units|amount|currency_code, purchase_units|amount|value, purchase_units|amount|breakdown|item_total|currency_code, purchase_units|amount|breakdown|item_total|value, purchase_units|amount|breakdown|shipping|currency_code, purchase_units|amount|breakdown|shipping|value, purchase_units|amount|breakdown|tax_total|currency_code, purchase_units|amount|breakdown|tax_total|value, purchase_units|amount|breakdown|discount|currency_code, purchase_units|amount|breakdown|discount|value, purchase_units|payee|email_address, purchase_units|payee|merchant_id, purchase_units|items|name, purchase_units|items|quantity, purchase_units|items|unit_amount|currency_code, purchase_units|items|unit_amount|value, purchase_units|items|tax|currency_code, purchase_units|items|tax|value, purchase_units|items|category, purchase_units|items|sku, purchase_units|shipping|name|full_name, purchase_units|shipping|address|address_line_1, purchase_units|shipping|address|address_line_2, purchase_units|shipping|address|admin_area_2, purchase_units|shipping|address|admin_area_1, purchase_units|shipping|address|postal_code, purchase_units|shipping|address|country_code, payer|name|given_name, payer|name|surname, payer|email_address, payer|address|address_line_1, payer|address|admin_area_2, payer|address|postal_code, payer|address|country_code, application_context|brand_name, application_context|landing_page, application_context|shipping_preference, application_context|user_action, application_context|return_url, application_context|cancel_url, payment_source|paypal, paypal_request_id } = context.messages.in.content;


        // https://developer.paypal.com/docs/api/orders/v2/#orders_create
        const { data } = await context.httpRequest({
            method: 'POST',
            url: 'https://api-m.sandbox.paypal.com/v2/checkout/orders',
            headers: {
                'Authorization': `Bearer ${context.auth.apiToken}`
            }
        });
    

return context.sendJson(data, 'out');
    }
};
