'use strict';

module.exports = {

    async receive(context) {

        const {
            folder_id,
            description,
            shared_link_access,
            shared_link_password,
            shared_link_unshared_at,
            shared_link_can_download,
            shared_link_can_preview,
            ifMatch
        } = context.messages.in.content;

        if (!folder_id) {
            throw new context.CancelError('Folder ID is required.');
        }

        // Build the request body
        const body = {};

        if (description !== undefined && description !== null) {
            body.description = description;
        }

        // Build shared_link object if any shared link properties are provided
        if (shared_link_access || shared_link_password || shared_link_unshared_at ||
            shared_link_can_download !== undefined || shared_link_can_preview !== undefined) {
            
            body.shared_link = {};

            if (shared_link_access) {
                body.shared_link.access = shared_link_access;
            }

            if (shared_link_password) {
                body.shared_link.password = shared_link_password;
            }

            if (shared_link_unshared_at) {
                body.shared_link.unshared_at = shared_link_unshared_at;
            }

            if (shared_link_can_download !== undefined || shared_link_can_preview !== undefined) {
                body.shared_link.permissions = {};

                if (shared_link_can_download !== undefined) {
                    body.shared_link.permissions.can_download = shared_link_can_download;
                }

                if (shared_link_can_preview !== undefined) {
                    body.shared_link.permissions.can_preview = shared_link_can_preview;
                }
            }
        }

        const headers = {
            'Authorization': `Bearer ${context.auth.accessToken}`,
            'Content-Type': 'application/json'
        };

        if (ifMatch) {
            headers['If-Match'] = ifMatch;
        }

        // https://developer.box.com/reference/put-folders-id/
        await context.httpRequest({
            method: 'PUT',
            url: `https://api.box.com/2.0/folders/${folder_id}`,
            headers: headers,
            data: body
        });

        return context.sendJson({}, 'out');
    }
};
