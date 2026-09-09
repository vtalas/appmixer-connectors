'use strict';
const commons = require('../../dropbox-commons');
const lib = require('../../lib');

/**
 * Declared shape of a single folder match. Shared by the dynamic output port
 * (via getOutputPortOptions) and by live verification.
 */
const ITEM_SCHEMA = {
    type: 'object',
    properties: {
        '.tag': {
            'type': 'string',
            'title': 'Tag',
            'example': 'folder'
        },
        'id': {
            'type': 'string',
            'title': 'ID',
            'example': 'id:abc123def456'
        },
        'name': {
            'type': 'string',
            'title': 'Name',
            'example': 'My Folder'
        },
        'path_display': {
            'type': 'string',
            'title': 'Path Display',
            'example': '/Documents/My Folder'
        },
        'path_lower': {
            'type': 'string',
            'title': 'Path Lower',
            'example': '/documents/my folder'
        }
    }
};

module.exports = {

    ITEM_SCHEMA,

    async receive(context) {

        const { name, maxResults, mode, outputType } = context.messages.query.content;

        // Schema generation runs without real input values.
        if (context.properties.generateOutputPortOptions) {
            return lib.getOutputPortOptions(context, outputType, ITEM_SCHEMA.properties, { label: 'Folders' });
        }

        if (!name) {
            throw new context.CancelError('Name is required!');
        }

        const params = {
            path: '',
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
            .filter((entry) => entry.metadata['.tag'] === 'folder')
            .map((entry) => entry.metadata);

        if (records.length === 0) {
            return context.sendJson({}, 'notFound');
        }

        return lib.sendArrayOutput({ context, outputType, records });
    }
};
