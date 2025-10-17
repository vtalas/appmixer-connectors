'use strict';

const lib = require('../../lib.generated');

module.exports = {

    async receive(context) {

        const content = context.messages.in.content || {};
        const { name, parent } = content;
        
        // Handle both flat property 'parent|id' and nested object 'parent.id'
        const parentId = content['parent|id'] || (parent && parent.id);

        if (!name) {
            throw new context.CancelError('Folder name is required.');
        }

        if (!parentId) {
            throw new context.CancelError('Parent folder ID is required.');
        }

        // https://developer.box.com/reference/post-folders/
        const { data } = await context.httpRequest({
            method: 'POST',
            url: 'https://api.box.com/2.0/folders',
            headers: {
                'Authorization': `Bearer ${context.auth.apiToken}`,
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
