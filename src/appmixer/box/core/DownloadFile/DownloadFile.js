'use strict';

const lib = require('../../lib.generated');

module.exports = {
    async receive(context) {

        const { file_id, version } = context.messages.in.content;

        if (!file_id) {
            throw new context.CancelError('File Id is required!');
        }

        // https://developer.box.com/reference/get-files-id-content/
        const params = {};
        if (version) {
            params.version = version;
        }

        const response = await context.httpRequest({
            method: 'GET',
            url: `https://api.box.com/2.0/files/${file_id}/content`,
            headers: {
                'Authorization': `Bearer ${context.auth.accessToken}`
            },
            params: params,
            rawResponse: true
        });

        // Get file metadata from response headers
        const contentDisposition = response.headers['content-disposition'] || '';
        const fileName = contentDisposition.split('filename=')[1]?.replace(/"/g, '') || file_id;
        const contentType = response.headers['content-type'] || 'application/octet-stream';
        const size = parseInt(response.headers['content-length'] || '0', 10);

        // Save the file and get fileId
        const savedFile = await context.saveFileStream(fileName, response.data);

        return context.sendJson({
            fileId: savedFile.fileId,
            fileName: fileName,
            contentType: contentType,
            size: size,
            note: `Downloaded from Box (File ID: ${file_id})`
        }, 'out');
    }
};
