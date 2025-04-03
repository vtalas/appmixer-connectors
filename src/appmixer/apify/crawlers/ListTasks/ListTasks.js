const lib = require('../../lib.generated');
module.exports = {
    async receive(context) {
        const { token, limit, offset } = context.messages.in.content;

        // https://docs.apify.com/api/v2#/reference/tasks/task-collection/get-list-of-tasks
        const { data } = await lib.httpRequest(context, { action: 'acts/${limit}/sldkjf' });

        return context.sendJson(data, 'out');
    }
};
