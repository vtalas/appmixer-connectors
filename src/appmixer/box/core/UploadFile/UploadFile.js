'use strict';

const FormData = require('form-data');

module.exports = {

    async receive(context) {

        const { parentId, name, file } = context.messages.in.content;

        if (!parentId) {
            throw new context.CancelError('Parent Folder ID is required!');
        }

        if (!file) {
            throw new context.CancelError('File is required!');
        }

        // Parse the data URL to extract file content and metadata
        const fileInfo = context.utils.parseDataURL(file);
        const fileName = name || fileInfo.filename || 'file';

        // Create form data for multipart/form-data upload
        const form = new FormData();
        form.append('attributes', JSON.stringify({
            name: fileName,
            parent: {
                id: parentId
            }
        }));
        form.append('file', fileInfo.data, {
            filename: fileName,
            contentType: fileInfo.mimeType
        });

        // https://developer.box.com/reference/post-files-content/
        const { data } = await context.httpRequest({
            method: 'POST',
            url: 'https://upload.box.com/api/2.0/files/content',
            headers: {
                'Authorization': `Bearer ${context.auth.accessToken}`,
                ...form.getHeaders()
            },
            data: form
        });

        return context.sendJson(data, 'out');
    }
};