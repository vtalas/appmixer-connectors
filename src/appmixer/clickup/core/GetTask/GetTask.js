'use strict';
const ClickUpClient = require('../../ClickUpClient');

module.exports = {

    async receive(context) {

        const { taskId } = context.messages.in.content;
        if (!taskId) {
            throw new context.CancelError('Task ID is required');
        }

        const cu = new ClickUpClient(context);

        try {
            const task = await cu.request('GET', `/task/${taskId}`);
            return context.sendJson(task, 'out');
        } catch (e) {
            const message = (e?.err || e?.message || '').toLowerCase();
            if (message.includes('not found')) {
                return context.sendJson({ taskId }, 'notFound');
            }
            throw e;
        }
    }
};
