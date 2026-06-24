'use strict';

// Fields declared on the output port. See the note at the request below.
const OUTPUT_FIELDS = 'type,id,file_version,sequence_id,etag,sha1,name,description,size,path_collection,created_at,modified_at,trashed_at,purged_at,content_created_at,content_modified_at,created_by,modified_by,owned_by,shared_link,parent,item_status';

module.exports = {

    async receive(context) {

        const {
            fileId,
            access,
            password,
            unsharedAt,
            canDownload,
            canPreview
        } = context.messages.in.content;

        if (!fileId) {
            throw new context.CancelError('File ID is required!');
        }

        // Build the shared link object
        const sharedLink = {};

        if (access) {
            sharedLink.access = access;
        }

        if (password) {
            sharedLink.password = password;
        }

        if (unsharedAt) {
            sharedLink.unshared_at = unsharedAt;
        }

        // Build permissions object if any permission is specified
        if (canDownload !== undefined || canPreview !== undefined) {
            sharedLink.permissions = {};
            if (canDownload !== undefined) {
                sharedLink.permissions.can_download = canDownload;
            }
            if (canPreview !== undefined) {
                sharedLink.permissions.can_preview = canPreview;
            }
        }

        // https://developer.box.com/reference/put-files-id--add-shared-link/
        // `fields` is required on this endpoint for shared_link to come back. Box narrows
        // the response to the mini representation plus whatever is listed, so the full set
        // declared on the output port is requested — asking for shared_link alone would
        // drop every other field this component promises.
        const { data } = await context.httpRequest({
            method: 'PUT',
            url: `https://api.box.com/2.0/files/${fileId}`,
            headers: {
                'Authorization': `Bearer ${context.auth.accessToken}`,
                'Content-Type': 'application/json'
            },
            params: { fields: OUTPUT_FIELDS },
            data: {
                shared_link: sharedLink
            }
        });

        return context.sendJson(data, 'out');
    }
};
