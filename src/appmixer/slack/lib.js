'use strict';

const pathModule = require('path');
const Entities = require('html-entities').AllHtmlEntities;
const { WebClient } = require('@slack/web-api');

module.exports = {

    /**
     * Send slack channel message.
     * @param {string} channelId
     * @param {string} message
     * @param {string} accessToken
     * @return {Promise<*>}
     */
    async sendMessage(channelId, message, accessToken) {

        let entities = new Entities();
        const web = new WebClient(accessToken);

        const response = await web.chat.postMessage({
            channel: channelId,
            text: entities.decode(message),
            as_user: true
        });

        return response.message;
    },

    // TODO: Move to appmixer-lib
    // Expects standardized outputType: 'item', 'items', 'file', 'first'
    async sendArrayOutput({ context, outputPortName = 'out', outputType = 'first', records = [] }) {

        if (outputType === 'first') {
            // First item found only.
            await context.sendJson(records[0], outputPortName);
        } else if (outputType === 'object') {
            // One by one.
            await context.sendArray(records, outputPortName);
        } else if (outputType === 'array') {
            // All at once.
            await context.sendJson({ records }, outputPortName);
        } else if (outputType === 'file') {
            // Into CSV file.
            const headers = Object.keys(records[0] || {});
            let csvRows = [];
            csvRows.push(headers.join(','));
            for (const record of records) {
                const values = headers.map(header => {
                    const val = record[header];
                    return `"${val}"`;
                });
                // To add ',' separator between each value
                csvRows.push(values.join(','));
            }
            const csvString = csvRows.join('\n');
            let buffer = Buffer.from(csvString, 'utf8');
            const componentName = context.flowDescriptor[context.componentId].label || context.componentId;
            const fileName = `${context.config.outputFilePrefix || 'slack-lists'}-${componentName}.csv`;
            const savedFile = await context.saveFileStream(pathModule.normalize(fileName), buffer);
            await context.log({ step: 'File was saved', fileName, fileId: savedFile.fileId });
            await context.sendJson({ fileId: savedFile.fileId }, outputPortName);
        } else {
            throw new context.CancelError('Unsupported outputType ' + outputType);
        }
    }
};
