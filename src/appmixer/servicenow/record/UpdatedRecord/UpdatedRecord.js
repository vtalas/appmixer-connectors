/* eslint-disable camelcase */
'use strict';

module.exports = {

    async start(context) {

        const tableName = context.properties.tableName;
        context.log({ stage: 'start', name: `${tableName}.update` });
        return context.addListener(`${tableName}.update`);
    },

    async stop(context) {

        const tableName = context.properties.tableName;
        return context.removeListener(`${tableName}.update`);
    },

    async receive(context) {

        if (context.messages.webhook) {
            await context.sendJson(context.messages.webhook.content.data, 'out');
        }
    }
};
