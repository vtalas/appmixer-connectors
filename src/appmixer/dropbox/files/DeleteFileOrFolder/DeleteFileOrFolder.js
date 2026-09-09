'use strict';
const commons = require('../../dropbox-commons');

/**
 * Component for deleting a file or folder.
 * @extends {Component}
 */
module.exports = {

    receive(context) {

        const { path } = context.messages.in.content;
        if (!path) {
            throw new context.CancelError('Path is required');
        }

        return commons
            .dropboxRequest(context, context.auth.accessToken, 'files', 'delete_v2', JSON.stringify({ path }))
            .then(() => context.sendJson({}, 'out'));
    }
};
