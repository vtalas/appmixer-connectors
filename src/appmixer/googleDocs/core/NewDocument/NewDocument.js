'use strict';

const GOOGLE_DOCS_MIME_TYPE = 'application/vnd.google-apps.document';
const FOLDER_MIME_TYPE = 'application/vnd.google-apps.folder';

/**
 * Recursively fetches all subfolder IDs for a given folder.
 * @param {Object} context - Appmixer context
 * @param {string} folderId - Parent folder ID
 * @param {string[]} folderIds - Accumulator array for folder IDs
 * @returns {Promise<string[]>} Array of all subfolder IDs
 */
async function getSubfolderIds(context, folderId, folderIds = []) {

    const { data } = await context.httpRequest({
        method: 'GET',
        url: 'https://www.googleapis.com/drive/v3/files',
        params: {
            q: `'${folderId}' in parents and mimeType='${FOLDER_MIME_TYPE}' and trashed=false`,
            fields: 'files(id)',
            pageSize: 1000
        },
        headers: {
            'Authorization': `Bearer ${context.auth.accessToken}`
        }
    });

    for (const folder of (data.files || [])) {
        folderIds.push(folder.id);
        await getSubfolderIds(context, folder.id, folderIds);
    }

    return folderIds;
}

module.exports = {

    async tick(context) {

        const { folderId, recursive } = context.properties;

        // Load state
        const state = await context.loadState();

        // Build folder IDs list for filtering
        let folderIds = [];
        if (folderId) {
            folderIds.push(folderId);

            if (recursive) {
                // Check for cached subfolder IDs
                if (state.cachedFolderIds) {
                    folderIds = state.cachedFolderIds;
                } else {
                    // Fetch all subfolder IDs recursively
                    const subfolderIds = await getSubfolderIds(context, folderId);
                    folderIds = [folderId, ...subfolderIds];
                    // Cache for next tick
                    await context.stateSet('cachedFolderIds', folderIds);
                }
            }
        }

        // Build query for Google Drive API to get only Google Docs documents
        // If recursive mode, we don't filter by parent in query (we post-filter instead)
        let query = `mimeType='${GOOGLE_DOCS_MIME_TYPE}' and trashed=false`;
        if (folderId && !recursive) {
            query += ` and '${folderId}' in parents`;
        }

        // Fetch documents sorted by creation time (newest first)
        // Include 'parents' field for recursive filtering
        const { data } = await context.httpRequest({
            method: 'GET',
            url: 'https://www.googleapis.com/drive/v3/files',
            params: {
                q: query,
                fields: 'files(id,name,mimeType,createdTime,modifiedTime,webViewLink,owners,lastModifyingUser,parents)',
                orderBy: 'createdTime desc',
                pageSize: 100
            },
            headers: {
                'Authorization': `Bearer ${context.auth.accessToken}`
            }
        });

        let documents = data.files || [];

        // Post-filter for recursive mode - only include documents in monitored folders
        if (folderId && recursive && folderIds.length > 0) {
            documents = documents.filter(doc =>
                doc.parents?.some(parentId => folderIds.includes(parentId))
            );
        }

        // Get known document IDs from state
        const known = state.known ? new Set(state.known) : null;

        // Find new documents
        const newDocuments = [];
        const currentIds = [];

        for (const doc of documents) {
            currentIds.push(doc.id);

            // If this is the first run (known is null), don't trigger for existing documents
            // Only trigger for documents created after the trigger was set up
            if (known && !known.has(doc.id)) {
                newDocuments.push(doc);
            }
        }

        // Send new documents to output port (newest first)
        for (const doc of newDocuments) {
            await context.sendJson(doc, 'out');
        }

        // Save current document IDs to state for next tick
        await context.saveState({ ...state, known: currentIds });
    }
};
