'use strict';

module.exports = {
    async receive(context) {

        const {
            title,
            from_date,
            end_date,
            time_zone,
            targetable_type,
            targetable_id,
            location,
            description,
            attendee_name,
            attendee_email
        } = context.messages.in.content;

        // Validate required fields
        if (!title) {
            throw new context.CancelError('Title is required!');
        }
        if (!from_date) {
            throw new context.CancelError('From Date is required!');
        }
        if (!end_date) {
            throw new context.CancelError('End Date is required!');
        }

        // Build request payload
        const appointmentData = {
            appointment: {
                title,
                from_date,
                end_date
            }
        };

        // Add optional fields
        if (time_zone) {
            appointmentData.appointment.time_zone = time_zone;
        }
        if (location) {
            appointmentData.appointment.location = location;
        }
        if (description) {
            appointmentData.appointment.description = description;
        }
        if (targetable_type && targetable_id) {
            appointmentData.appointment.targetable_type = targetable_type;
            appointmentData.appointment.targetable_id = targetable_id;
        }

        // Make API request
        const { data } = await context.httpRequest({
            method: 'POST',
            url: `https://${context.auth.domain}/api/appointments`,
            headers: {
                'Authorization': `Token token=${context.auth.apiKey}`,
                'Content-Type': 'application/json'
            },
            data: appointmentData
        });

        return context.sendJson(data, 'out');
    }
};
