'use strict';
const commons = require('../../dropbox-commons');
const lib = require('../../lib');

/**
 * Declared shape of a single file match. Shared by the dynamic output port
 * (via getOutputPortOptions) and by live verification.
 */
const ITEM_SCHEMA = {
    type: 'object',
    properties: {
        '.tag': {
            'type': 'string',
            'title': 'Tag',
            'example': 'file'
        },
        'client_modified': {
            'type': 'string',
            'title': 'Client Modified',
            'example': '2024-07-15T12:30:00Z'
        },
        'content_hash': {
            'type': 'string',
            'title': 'Content Hash',
            'example': 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855'
        },
        'id': {
            'type': 'string',
            'title': 'ID',
            'example': 'id:abc123def456'
        },
        'name': {
            'type': 'string',
            'title': 'Name',
            'example': 'report.pdf'
        },
        'path_display': {
            'type': 'string',
            'title': 'Path Display',
            'example': '/Documents/report.pdf'
        },
        'path_lower': {
            'type': 'string',
            'title': 'Path Lower',
            'example': '/documents/report.pdf'
        },
        'rev': {
            'type': 'string',
            'title': 'Rev',
            'example': '015f2e5d4a1c70000000109d2de60'
        },
        'server_modified': {
            'type': 'string',
            'title': 'Server Modified',
            'example': '2024-07-15T12:35:00Z'
        },
        'size': {
            'type': 'number',
            'title': 'Size',
            'example': 524288
        }
    }
};

module.exports = {

    ITEM_SCHEMA,

    async receive(context) {

        const { name, maxResults, mode, outputType } = context.messages.query.content;

        // Schema generation runs without real input values.
        if (context.properties.generateOutputPortOptions) {
            return lib.getOutputPortOptions(context, outputType, ITEM_SCHEMA.properties, { label: 'Files' });
        }

        if (!name) {
            throw new context.CancelError('Name is required!');
        }

        const params = {
            path: context.messages.query.content.path || '',
            query: name,
            start: 0,
            max_results: maxResults,
            mode
        };

        const { data } = await commons.dropboxRequest(
            context,
            context.auth.accessToken,
            'files',
            'search',
            JSON.stringify(params)
        );

        const records = (data.matches || [])
            .filter((entry) => entry.metadata['.tag'] === 'file')
            .map((entry) => entry.metadata);

        if (records.length === 0) {
            return context.sendJson({}, 'notFound');
        }

        return lib.sendArrayOutput({ context, outputType, records });
    }
};
