'use strict';

const commons = require('../../jira-commons');

module.exports = {

    async receive(context) {

        const { profileInfo: { apiUrl }, auth } = context;
        const { id, commentId } = context.messages.in.content;

        if (!id) {
            throw new context.CancelError('Issue ID or Key is required!');
        }
        if (!commentId) {
            throw new context.CancelError('Comment ID is required!');
        }

        await commons.delete(`${apiUrl}issue/${id}/comment/${commentId}`, auth);

        return context.sendJson({}, 'out');
    }
};
