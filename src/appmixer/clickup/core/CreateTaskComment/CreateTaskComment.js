'use strict';
const ClickUpClient = require('../../ClickUpClient');

module.exports = {

    async receive(context) {

        const { taskId, commentText, assignee, notifyAll } = context.messages.in.content;
        if (!taskId) {
            throw new context.CancelError('Task ID is required');
        }
        if (!commentText) {
            throw new context.CancelError('Comment text is required');
        }

        const cu = new ClickUpClient(context);

        const data = {
            comment_text: commentText,
            notify_all: notifyAll ?? false
        };
        if (assignee) {
            data.assignee = assignee;
        }

        const created = await cu.request('POST', `/task/${taskId}/comment`, { data });

        return context.sendJson(created, 'out');
    }
};
