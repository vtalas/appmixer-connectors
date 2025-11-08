'use strict';

module.exports = {
    async receive(context) {
        const {
            file_id: fileId,
            lock_expires_at: lockExpiresAt
        } = context.messages.in.content;

        if (!fileId) {
            throw new context.CancelError('File ID is required!');
        }

        const lockData = {
            lock: {
                type: 'lock'
            }
        };

        if (lockExpiresAt) {
            lockData.lock.expires_at = lockExpiresAt;
        }

        // https://developer.box.com/reference/put-files-id/
        const { data } = await context.httpRequest({
            method: 'PUT',
            url: `https://api.box.com/2.0/files/${fileId}`,
            headers: {
                'Authorization': `Bearer ${context.auth.accessToken}`
            },
            data: lockData
        });

        return context.sendJson(data, 'out');
    }
};
