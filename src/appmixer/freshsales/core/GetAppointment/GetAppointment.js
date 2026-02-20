'use strict';

const api = require('../../api');

module.exports = {
    async receive(context) {
        const { id } = context.messages.in.content;
        if (!id) throw new context.CancelError('Appointment ID is required!');

        const { data } = await api.ViewAppointment.execute(context, { appointment_id: id });
        return context.sendJson(data.appointment, 'out');
    }
};
