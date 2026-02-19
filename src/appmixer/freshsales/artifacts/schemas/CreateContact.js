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

        // Validate required fields
        if (!first_name) {
            throw new context.CancelError('Contact first name is required!');
        }

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

        // Remove undefined values
        Object.keys(contactData).forEach(key => {
            if (contactData[key] === undefined || contactData[key] === null) {
                delete contactData[key];
            }
        });

        // Add optional fields if provided
        if (sales_accounts) {
            contactData.sales_accounts = sales_accounts;
        }
        if (tags) {
            contactData.tags = tags;
        }

        // Make the API call directly
        const response = await context.httpRequest({
            method: 'POST',
            url: `https://${context.auth.domain}/api/contacts`,
            data: { contact: contactData },
            headers: {
                'Authorization': `Bearer ${context.auth.accessToken}`,
                'Content-Type': 'application/json'
            }
        });

        return context.sendJson(response.data.contact, 'out');
    }
};
