'use strict';

module.exports = {
    async receive(context) {

        const { id, title, description, due_date, task_type, priority, status, owner_id } = context.messages.in.content;

        if (!id) throw new context.CancelError('Task ID is required!');

        const task = {};
        if (title !== undefined) task.title = title;
        if (description !== undefined) task.description = description;
        if (due_date !== undefined) task.due_date = due_date;
        if (task_type !== undefined) task.task_type = task_type;
        if (priority !== undefined) task.priority = priority;
        if (status !== undefined) task.status = status;
        if (owner_id !== undefined) task.owner_id = parseInt(owner_id);

        const { data } = await context.httpRequest({
            method: 'PUT',
            url: `https://${context.auth.domain}/api/tasks/${id}`,
            headers: {
                'Authorization': `Token token=${context.auth.apiKey}`,
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            data: { task }
        });

        return context.sendJson(data.task, 'out');
    }
};
