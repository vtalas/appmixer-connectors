'use strict';

module.exports = {
    async receive(context) {

        const {
            first_name,
            last_name,
            email,
            mobile_number,
            work_number,
            job_title,
            website,
            address,
            city,
            state,
            country,
            zipcode,
            custom_field,
            sales_accounts,
            tags
        } = context.messages.in.content;

        // Build the contact object
        const contactData = {
            first_name,
            last_name,
            email,
            mobile_number,
            work_number,
            job_title,
            website,
            address,
            city,
            state,
            country,
            zipcode,
            custom_field
        };

        // Remove undefined/null values
        Object.keys(contactData).forEach(key => {
            if (contactData[key] === undefined || contactData[key] === null) {
                delete contactData[key];
            }
        });

        // Add optional array fields if provided
        if (sales_accounts) {
            contactData.sales_accounts = sales_accounts;
        }
        if (tags) {
            contactData.tags = tags;
        }

        const { domain, apiKey } = context.auth;
        const url = `https://${domain}/api/contacts`;

        const response = await context.httpRequest({
            method: 'POST',
            url,
            headers: {
                'Authorization': `Token token=${apiKey}`,
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            data: {
                contact: contactData
            }
        });

        return context.sendJson(response.data.contact, 'out');
    }
};
