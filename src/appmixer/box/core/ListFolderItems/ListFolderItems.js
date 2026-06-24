'use strict';

const lib = require('../../lib');

const schema = {
    'type': { 'type': 'string', 'title': 'Type', 'example': 'file' },
    'id': { 'type': 'string', 'title': 'Id', 'example': '123456789' },
    'name': { 'type': 'string', 'title': 'Name', 'example': 'report.pdf' },
    'sequence_id': { 'type': 'string', 'title': 'Sequence Id', 'example': '3' },
    'etag': { 'type': 'string', 'title': 'ETag', 'example': '3' },
    'sha1': { 'type': 'string', 'title': 'SHA1', 'example': '0bbd79a...' }
};

module.exports = {

    async receive(context) {

        const { folderId, outputType } = context.messages.in.content;

        if (context.properties.generateOutputPortOptions) {
            return lib.getOutputPortOptions(context, outputType, schema, { label: 'Items' });
        }

        if (!folderId) {
            throw new context.CancelError('Folder ID is required!');
        }

        const records = [];
        let offset = 0;
        const limit = 1000;
        let total = Infinity;

        // https://developer.box.com/reference/get-folders-id-items/
        while (offset < total) {
            const { data } = await context.httpRequest({
                method: 'GET',
                url: `https://api.box.com/2.0/folders/${folderId}/items`,
                headers: {
                    'Authorization': `Bearer ${context.auth.accessToken}`
                },
                params: { offset, limit }
            });

            const entries = data.entries || [];
            records.push(...entries);
            total = typeof data.total_count === 'number' ? data.total_count : records.length;

            if (entries.length === 0) {
                break;
            }
            offset += limit;
        }

        return lib.sendArrayOutput({ context, records, outputType });
    }
};
