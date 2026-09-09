'use strict';

const lib = require('../../lib');

const ITEM_SCHEMA = {
    'type': 'object',
    'properties': {
        'type': { 'type': 'string', 'title': 'Type', 'example': 'file' },
        'id': { 'type': 'string', 'title': 'Id', 'example': '123456789' },
        'name': { 'type': 'string', 'title': 'Name', 'example': 'report.pdf' },
        'created_at': { 'type': 'string', 'title': 'Created At', 'example': '2026-01-15T10:30:00-08:00' },
        'modified_at': { 'type': 'string', 'title': 'Modified At', 'example': '2026-01-16T12:00:00-08:00' },
        'size': { 'type': 'integer', 'title': 'Size', 'example': 20480 },
        'description': { 'type': 'string', 'title': 'Description', 'example': 'Quarterly report' },
        'path_collection': {
            'type': 'object',
            'title': 'Path Collection',
            'properties': {
                'total_count': { 'type': 'integer', 'title': 'Path Collection.Total Count', 'example': 1 },
                'entries': {
                    'type': 'array',
                    'title': 'Path Collection.Entries',
                    'items': {
                        'type': 'object',
                        'properties': {
                            'type': { 'type': 'string', 'title': 'Path Collection.Entries.Type', 'example': 'folder' },
                            'id': { 'type': 'string', 'title': 'Path Collection.Entries.Id', 'example': '0' },
                            'name': { 'type': 'string', 'title': 'Path Collection.Entries.Name', 'example': 'All Files' }
                        }
                    }
                }
            }
        },
        'created_by': {
            'type': 'object',
            'title': 'Created By',
            'properties': {
                'type': { 'type': 'string', 'title': 'Created By.Type', 'example': 'user' },
                'id': { 'type': 'string', 'title': 'Created By.Id', 'example': '11446498' },
                'name': { 'type': 'string', 'title': 'Created By.Name', 'example': 'Aaron Levie' },
                'login': { 'type': 'string', 'title': 'Created By.Login', 'example': 'aaron@example.com' }
            }
        },
        'modified_by': {
            'type': 'object',
            'title': 'Modified By',
            'properties': {
                'type': { 'type': 'string', 'title': 'Modified By.Type', 'example': 'user' },
                'id': { 'type': 'string', 'title': 'Modified By.Id', 'example': '11446498' },
                'name': { 'type': 'string', 'title': 'Modified By.Name', 'example': 'Aaron Levie' },
                'login': { 'type': 'string', 'title': 'Modified By.Login', 'example': 'aaron@example.com' }
            }
        },
        'owned_by': {
            'type': 'object',
            'title': 'Owned By',
            'properties': {
                'type': { 'type': 'string', 'title': 'Owned By.Type', 'example': 'user' },
                'id': { 'type': 'string', 'title': 'Owned By.Id', 'example': '11446498' },
                'name': { 'type': 'string', 'title': 'Owned By.Name', 'example': 'Aaron Levie' },
                'login': { 'type': 'string', 'title': 'Owned By.Login', 'example': 'aaron@example.com' }
            }
        },
        'shared_link': {
            'type': 'object',
            'title': 'Shared Link',
            'properties': {
                'url': { 'type': 'string', 'title': 'Shared Link.Url', 'example': 'https://app.box.com/s/abcdef' },
                'download_url': { 'type': 'string', 'title': 'Shared Link.Download Url', 'example': 'https://app.box.com/shared/static/abcdef.pdf' }
            }
        }
    }
};

// Field set requested from the folder-items endpoint so that browsing a folder returns
// the same shape as searching. Without it Box only returns type/id/name/etag/sequence_id.
// Only the list path sends this: on /search Box already returns the full standard
// representation, and passing `fields` there would *narrow* it — per the Box docs,
// "none of the standard fields are returned in the response unless explicitly specified".
const LIST_FIELDS = Object.keys(ITEM_SCHEMA.properties).join(',');

const PAGE_SIZE = 1000;
const SEARCH_LIMIT = 200;

/**
 * List the direct children of a folder. Used when no query is provided.
 * https://developer.box.com/reference/get-folders-id-items/
 */
async function listFolderItems(context, { folderId, fields }) {

    const records = [];
    let offset = 0;
    let total = Infinity;

    while (offset < total) {
        const { data } = await context.httpRequest({
            method: 'GET',
            url: `https://api.box.com/2.0/folders/${folderId}/items`,
            headers: {
                'Authorization': `Bearer ${context.auth.accessToken}`
            },
            params: { offset, limit: PAGE_SIZE, fields }
        });

        const entries = data.entries || [];
        records.push(...entries);
        total = typeof data.total_count === 'number' ? data.total_count : records.length;

        if (entries.length === 0) {
            break;
        }
        offset += PAGE_SIZE;
    }

    return records;
}

/**
 * Search the whole account by query.
 * https://developer.box.com/reference/get-search/
 */
async function searchItems(context, { query, type, scope, contentTypes, fields }) {

    const params = { query, limit: SEARCH_LIMIT };

    if (fields) {
        params.fields = fields;
    }

    if (type) {
        params.type = type;
    }

    if (scope) {
        params.ancestor_folder_ids = scope;
    }

    if (contentTypes) {
        const contentTypesArray = lib.normalizeMultiselectInput(contentTypes, context, 'Content Types');
        params.content_types = contentTypesArray.join(',');
    }

    const { data } = await context.httpRequest({
        method: 'GET',
        url: 'https://api.box.com/2.0/search',
        headers: {
            'Authorization': `Bearer ${context.auth.accessToken}`
        },
        params
    });

    return data.entries || [];
}

module.exports = {

    ITEM_SCHEMA,

    async receive(context) {

        const {
            query,
            type,
            folderId,
            ancestorFolderIds,
            contentTypes,
            fields,
            outputType,
            exactMatch
        } = context.messages.in.content;

        if (context.properties.generateOutputPortOptions) {
            return lib.getOutputPortOptions(context, outputType, ITEM_SCHEMA.properties, { label: 'Entries' });
        }

        let records;

        if (query) {
            records = await searchItems(context, {
                query,
                type,
                scope: ancestorFolderIds || folderId,
                contentTypes,
                fields
            });

            // Box Search uses tokenized/fuzzy matching, so an exact name match has to be
            // filtered client-side.
            if (exactMatch) {
                records = records.filter(item => item.name === query);
            }
        } else {
            // No query: browse the folder instead of searching. Box has no "match everything"
            // search term, and the search index lags behind writes by minutes.
            records = await listFolderItems(context, {
                folderId: folderId || '0',
                fields: fields || LIST_FIELDS
            });

            if (type) {
                records = records.filter(item => item.type === type);
            }
        }

        if (records.length === 0) {
            return context.sendJson({}, 'notFound');
        }

        return lib.sendArrayOutput({ context, records, outputType });
    }
};
