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
            description
        } = context.messages.in.content;

        // Build appointment object with required fields
        const appointment = {
            title,
            from_date,
            end_date
        };

        // Add optional fields only if provided
        if (time_zone) appointment.time_zone = time_zone;
        if (location) appointment.location = location;
        if (description) appointment.description = description;
        if (targetable_type) appointment.targetable_type = targetable_type;
        if (targetable_id) appointment.targetable_id = targetable_id;

        const { data } = await context.httpRequest({
            method: 'POST',
            url: `https://${context.auth.domain}/api/appointments`,
            headers: {
                'Authorization': `Token token=${context.auth.apiKey}`,
                'Content-Type': 'application/json'
            },
            data: { appointment }
        });

        return context.sendJson(data, 'out');
    }
};
