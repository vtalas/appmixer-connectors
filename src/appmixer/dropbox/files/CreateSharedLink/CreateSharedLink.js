'use strict';
const commons = require('../../dropbox-commons');

/**
 * Component for creating a shared link for a file or folder.
 * If a shared link already exists, the existing one is returned.
 * @extends {Component}
 */
module.exports = {

    async receive(context) {

        const { path } = context.messages.in.content;
        if (!path) {
            throw new context.CancelError('Path is required');
        }

        const token = context.auth.accessToken;

        try {
            const { data } = await commons.dropboxRequest(
                context, token, 'sharing', 'create_shared_link_with_settings', JSON.stringify({ path })
            );
            return context.sendJson(data, 'out');
        } catch (err) {
            const summary = err.response?.data?.error_summary || '';
            if (summary.includes('shared_link_already_exists')) {
                const { data } = await commons.dropboxRequest(
                    context, token, 'sharing', 'list_shared_links', JSON.stringify({ path, direct_only: true })
                );
                const link = data.links && data.links[0];
                if (link) {
                    return context.sendJson(link, 'out');
                }
            }
            throw err;
        }
    }
};
