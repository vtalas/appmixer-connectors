
const lib = require('../../lib.generated');
module.exports = {
    async receive(context) {
        const { prompt, image, type, image_count, height, width, webhook_url } = context.messages.in.content;

        // https://www.everart.ai/api/docs/#/Generations/post_models__id__generations_post
        const { data } = await context.httpRequest({
            method: 'POST',
            url: 'https://api.everart.ai/v1/models/{id}/generations',
            headers: {
                'Authorization': `Bearer ${context.auth.apiToken}`
            }
        });

        return context.sendJson(data, 'out');
    }
};
