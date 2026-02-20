'use strict';

const api = require('../../api');

module.exports = {
    async receive(context) {

        const {
            id,
            first_name,
            last_name,
            email,
            mobile_number,
            work_number,
            job_title,
            address,
            city,
            state,
            country,
            zipcode,
            time_zone,
            keyword,
            medium,
            facebook,
            twitter,
            linkedin
        } = context.messages.in.content;

        if (!id) {
            throw new context.CancelError('Contact ID is required!');
        }

        const contactData = {
            first_name, last_name, email, mobile_number, work_number,
            job_title, address, city, state, country, zipcode,
            time_zone, keyword, medium, facebook, twitter, linkedin
        };

        // Remove undefined/null values
        Object.keys(contactData).forEach(key => {
            if (contactData[key] === undefined || contactData[key] === null || contactData[key] === '') {
                delete contactData[key];
            }
        });

        const { data } = await api.UpdateContact.execute(context, {
            id,
            contact: contactData
        });

        return context.sendJson(data.contact, 'out');
    }
};
