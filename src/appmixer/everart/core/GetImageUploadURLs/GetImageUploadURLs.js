
const lib = require('../../lib.generated');
module.exports = {
    async receive(context) {
        const { images, filename, content_type, id } = context.messages.in.content;

        // https://www.everart.ai/api/docs/#/Assets/get_images_uploads_post
        const { data } = await context.httpRequest({
            method: 'POST',
            url: 'https://api.everart.ai/v1/images/uploads',
            headers: {
                'Authorization': `Bearer ${context.auth.apiToken}`
            }
        });

        return context.sendJson(data, 'out');
    }
};
