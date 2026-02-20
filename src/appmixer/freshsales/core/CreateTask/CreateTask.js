'use strict';

module.exports = {
    async receive(context) {

        const {
            title,
            description,
            due_date,
            task_type,
            priority,
            status,
            owner_id,
            contact_id,
            account_id,
            deal_id,
            is_notification_set
        } = context.messages.in.content;

        if (!title) {
            throw new context.CancelError('Title is required!');
        }

        const task = {
            title,
            ...(description && { description }),
            ...(due_date && { due_date }),
            ...(task_type && { task_type }),
            ...(priority && { priority }),
            ...(status && { status }),
            ...(owner_id && { owner_id: parseInt(owner_id) }),
            ...(contact_id && { contact_id: parseInt(contact_id) }),
            ...(account_id && { account_id: parseInt(account_id) }),
            ...(deal_id && { deal_id: parseInt(deal_id) }),
            ...(typeof is_notification_set !== 'undefined' && { is_notification_set })
        };

        const response = await context.httpRequest({
            method: 'POST',
            url: `https://${context.auth.domain}/api/tasks`,
            headers: {
                'Authorization': `Token token=${context.auth.apiKey}`,
                'Content-Type': 'application/json'
            },
            data: { task }
        });

        return context.sendJson(response.data.task, 'out');
    }
};
