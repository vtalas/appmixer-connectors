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
        const fileInfo = parseDataURL(file);
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

/**
 * Parse a data URL and extract the file content, MIME type, and filename
 * @param {string} dataUrl - The data URL to parse
 * @returns {object} Object containing data (Buffer), mimeType, and filename
 */
function parseDataURL(dataUrl) {
    // Match data URL format: data:[<mediatype>][;base64],<data>
    const match = dataUrl.match(/^data:([^;]+)(?:;(base64))?,(.+)$/);

    if (!match) {
        throw new Error('Invalid data URL format');
    }

    const mimeType = match[1] || 'application/octet-stream';
    const isBase64 = match[2] === 'base64';
    const data = match[3];

    // Decode the data
    let buffer;
    if (isBase64) {
        buffer = Buffer.from(data, 'base64');
    } else {
        buffer = Buffer.from(decodeURIComponent(data), 'utf8');
    }

    // Extract filename from MIME type or use default
    let filename = 'file';
    const mimeToExt = {
        'text/plain': 'txt',
        'application/json': 'json',
        'application/pdf': 'pdf',
        'image/png': 'png',
        'image/jpeg': 'jpg',
        'image/gif': 'gif',
        'text/csv': 'csv',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'docx',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'xlsx'
    };

    const ext = mimeToExt[mimeType] || 'bin';
    filename = `file.${ext}`;

    return {
        data: buffer,
        mimeType,
        filename
    };
}
