'use strict';
const lib = require('../../lib');

/**
 * Component for fetching the contents of a file from a repository.
 */
module.exports = {

    async receive(context) {

        const { repositoryId, path, ref } = context.properties;

        if (!path) {
            throw new context.CancelError('File Path is required!');
        }

        const params = {};
        if (ref) {
            params.ref = ref;
        }

        try {
            const { data } = await lib.apiRequest(
                context,
                `repos/${repositoryId}/contents/${path}`,
                { params }
            );

            // For a regular file the API returns base64-encoded content. Decode it for convenience.
            let decodedContent = '';
            if (data && data.encoding === 'base64' && typeof data.content === 'string') {
                decodedContent = Buffer.from(data.content, 'base64').toString('utf8');
            }

            return context.sendJson({ ...data, decodedContent }, 'out');
        } catch (err) {
            if (err.response?.status === 404) {
                return context.sendJson({ repositoryId, path }, 'notFound');
            }
            throw err;
        }
    }
};
