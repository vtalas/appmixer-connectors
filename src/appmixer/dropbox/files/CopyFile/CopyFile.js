'use strict';
const commons = require('../../dropbox-commons');

/**
 * Component for copying a file or folder to a new location.
 * @extends {Component}
 */
module.exports = {

    receive(context) {

        const { fromPath, toPath, autorename } = context.messages.in.content;
        if (!fromPath) {
            throw new context.CancelError('From Path is required');
        }
        if (!toPath) {
            throw new context.CancelError('To Path is required');
        }

        const params = {
            from_path: fromPath,
            to_path: toPath,
            autorename: autorename ?? false
        };

        return commons
            .dropboxRequest(context, context.auth.accessToken, 'files', 'copy_v2', JSON.stringify(params))
            .then(({ data }) => context.sendJson(data.metadata, 'out'));
    }
};
