'use strict';

module.exports = {

    async receive(context) {

        const { data } = await context.httpRequest({
            method: 'GET',
            url: 'https://www.googleapis.com/drive/v3/files',
            params: {
                q: 'mimeType=\'application/vnd.google-apps.folder\' and trashed=false',
                fields: 'files(id,name)',
                orderBy: 'name',
                pageSize: 1000
            },
            headers: {
                'Authorization': `Bearer ${context.auth.accessToken}`
            }
        });

        return context.sendJson(data.files || [], 'out');
    }
};
