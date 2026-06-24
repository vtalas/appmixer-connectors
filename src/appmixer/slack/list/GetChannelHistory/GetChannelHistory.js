/* eslint-disable camelcase */
'use strict';

const lib = require('../../lib');
const { WebClient } = require('@slack/web-api');

const outputPortName = 'out';

const schema = {
    type:        { type: 'string', title: 'Type',                example: 'message' },
    ts:          { type: 'string', title: 'Message ID (ts)',     example: '1609459200.000400' },
    user:        { type: 'string', title: 'User ID',             example: 'U01234567' },
    text:        { type: 'string', title: 'Text',                example: 'Hello team!' },
    thread_ts:   { type: 'string', title: 'Thread ID (ts)',      example: '1609459200.000400' },
    reply_count: { type: 'number', title: 'Reply Count',         example: 3 }
};

module.exports = {

    /**
     * @link https://api.slack.com/methods/conversations.history
     */
    async receive(context) {

        const { outputType, channelId, limit } = context.messages.in.content;

        if (context.properties.generateOutputPortOptions) {
            return this.getOutputPortOptions(context, outputType);
        }

        if (!channelId) {
            throw new context.CancelError('Channel is required!');
        }

        const web = new WebClient(context.auth.accessToken);
        const messages = [];
        let cursor;

        do {
            const response = await web.conversations.history({
                channel: channelId,
                limit: Math.min(limit || 200, 200),
                ...(cursor ? { cursor } : {})
            });
            messages.push(...(response.messages || []));
            cursor = response.response_metadata?.next_cursor;
        } while (cursor && (!limit || messages.length < limit));

        const records = limit ? messages.slice(0, limit) : messages;

        return lib.sendArrayOutput({ context, outputPortName, outputType, records });
    },

    getOutputPortOptions(context, outputType) {

        if (outputType === 'object' || outputType === 'first') {
            const options = Object.entries(schema).map(([field, def]) => {
                const { title: label, ...rest } = def;
                return { label, value: field, schema: rest };
            });
            return context.sendJson(options, outputPortName);
        }

        if (outputType === 'array') {
            return context.sendJson([{
                label: 'Messages',
                value: 'records',
                schema: {
                    type: 'array',
                    items: { type: 'object', properties: schema }
                }
            }], outputPortName);
        }

        if (outputType === 'file') {
            return context.sendJson([
                { label: 'File ID', value: 'fileId', schema: { type: 'string', format: 'appmixer-file-id' } }
            ], outputPortName);
        }

        return context.sendJson([], outputPortName);
    }
};
