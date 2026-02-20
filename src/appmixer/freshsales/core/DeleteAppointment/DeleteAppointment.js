'use strict';

const api = require('../../api');

module.exports = {
    async receive(context) {
        const { id } = context.messages.in.content;
        if (!id) throw new context.CancelError('Appointment ID is required!');

        await api.DeleteAppointment.execute(context, { appointment_id: id });
        return context.sendJson({ id, deleted: true }, 'out');
    }
};
