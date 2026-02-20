'use strict';

const api = require('../../api');

module.exports = {
    async receive(context) {
        const { id, title, from_date, end_date, time_zone, location, description } = context.messages.in.content;
        if (!id) throw new context.CancelError('Appointment ID is required!');

        const appointment = {};
        if (title) appointment.title = title;
        if (from_date) appointment.from_date = from_date;
        if (end_date) appointment.end_date = end_date;
        if (time_zone) appointment.time_zone = time_zone;
        if (location) appointment.location = location;
        if (description) appointment.description = description;

        const { data } = await api.UpdateAppointment.execute(context, { appointment_id: id, appointment });
        return context.sendJson(data.appointment, 'out');
    }
};
