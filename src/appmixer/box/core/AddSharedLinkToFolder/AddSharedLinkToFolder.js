
'use strict';

const lib = require('../../lib.generated');
module.exports = {
    async receive(context) {        

        const { folder_id, shared_link|access, shared_link|password, shared_link|unshared_at, shared_link|permissions|can_download, shared_link|permissions|can_preview } = context.messages.in.content;


        // https://developer.box.com/guides/shared-links/create/
        const { data } = await context.httpRequest({
            method: 'PUT',
            url: 'https://api.box.com/2.0/folders/{folder_id}',
            headers: {
                'Authorization': `Bearer ${context.auth.apiToken}`
            }
        });
    

return context.sendJson(data, 'out');
    }
};
