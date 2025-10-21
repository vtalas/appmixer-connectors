'use strict';

module.exports = {

    async receive(context) {

        const {
            fileId,
            name,
            description,
            parentId,
            tags,
            sharedLinkAccess,
            sharedLinkPassword,
            sharedLinkUnsharedAt,
            sharedLinkCanDownload,
            sharedLinkCanPreview,
            ifMatch
        } = context.messages.in.content;

        if (!fileId) {
            throw new context.CancelError('File ID is required!');
        }

        // Build the request body with only provided fields
        const updateData = {};

        if (name) {
            updateData.name = name;
        }

        if (description !== undefined) {
            updateData.description = description;
        }

        if (parentId) {
            updateData.parent = { id: parentId };
        }

        if (tags) {
            updateData.tags = tags;
        }

        // Build shared_link object if any shared link fields are provided
        if (sharedLinkAccess || sharedLinkPassword || sharedLinkUnsharedAt ||
            sharedLinkCanDownload !== undefined || sharedLinkCanPreview !== undefined) {

            updateData.shared_link = {};

            if (sharedLinkAccess) {
                updateData.shared_link.access = sharedLinkAccess;
            }

            if (sharedLinkPassword) {
                updateData.shared_link.password = sharedLinkPassword;
            }

            if (sharedLinkUnsharedAt) {
                updateData.shared_link.unshared_at = sharedLinkUnsharedAt;
            }

            if (sharedLinkCanDownload !== undefined || sharedLinkCanPreview !== undefined) {
                updateData.shared_link.permissions = {};

                if (sharedLinkCanDownload !== undefined) {
                    updateData.shared_link.permissions.can_download = sharedLinkCanDownload;
                }

                if (sharedLinkCanPreview !== undefined) {
                    updateData.shared_link.permissions.can_preview = sharedLinkCanPreview;
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

        // https://developer.box.com/reference/put-files-id/
        await context.httpRequest({
            method: 'PUT',
            url: `https://api.box.com/2.0/files/${fileId}`,
            headers: headers,
            data: updateData
        });

        return context.sendJson({}, 'out');
    }
};
