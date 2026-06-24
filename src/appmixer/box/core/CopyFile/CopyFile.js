'use strict';

module.exports = {

    async receive(context) {

        const { fileId, parentId, name } = context.messages.in.content;

        if (!fileId) {
            throw new context.CancelError('File ID is required!');
        }
        if (!parentId) {
            throw new context.CancelError('Destination Folder ID is required!');
        }

        const body = { parent: { id: parentId } };
        if (name) {
            body.name = name;
        }

        // https://developer.box.com/reference/post-files-id-copy/
        const { data } = await context.httpRequest({
            method: 'POST',
            url: `https://api.box.com/2.0/files/${fileId}/copy`,
            headers: {
                'Authorization': `Bearer ${context.auth.accessToken}`
            },
            data: body
        });

        return context.sendJson(data, 'out');
    }
};
