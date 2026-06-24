'use strict';

const commons = require('../../jira-commons');

module.exports = {

    async receive(context) {

        const { profileInfo: { apiUrl }, auth } = context;
        const { id, comment } = context.messages.in.content;

        if (!id) {
            throw new context.CancelError('Issue ID or Key is required!');
        }
        if (!comment) {
            throw new context.CancelError('Comment is required!');
        }

        const result = await commons.post(
            `${apiUrl}issue/${id}/comment`,
            auth,
            { body: commons.buildDocType(comment) }
        );

        return context.sendJson(result, 'out');
    }
};
