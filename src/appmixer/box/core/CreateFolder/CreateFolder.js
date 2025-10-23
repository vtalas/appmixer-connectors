'use strict';

module.exports = {

    async receive(context) {

        const { name, parentId } = context.messages.in.content;

        if (!name) {
            throw new context.CancelError('Name is required!');
        }

        if (!parentId) {
            throw new context.CancelError('Parent Folder ID is required!');
        }

        // https://developer.box.com/reference/post-folders/
        const { data } = await context.httpRequest({
            method: 'POST',
            url: 'https://api.box.com/2.0/folders',
            headers: {
                'Authorization': `Bearer ${context.auth.accessToken}`,
                'Content-Type': 'application/json'
            },
            data: {
                name: name,
                parent: {
                    id: parentId
                }
            }
        });

        return context.sendJson(data, 'out');
    }
};
