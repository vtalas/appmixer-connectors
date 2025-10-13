/* eslint-disable camelcase */
'use strict';

module.exports = {

    async start(context) {

        const tableName = context.properties.tableName;
        context.log({ stage: 'start', name: `${tableName}.delete` });
        return context.addListener(`${tableName}.delete`);
    },

    async stop(context) {

        const tableName = context.properties.tableName;
        return context.removeListener(`${tableName}.delete`);
    },

    async receive(context) {

        if (context.messages.webhook) {
            await context.sendJson(context.messages.webhook.content.data, 'out');
        }
    }
};
