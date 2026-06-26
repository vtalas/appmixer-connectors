'use strict';
const ClickUpClient = require('../../ClickUpClient');

const outputPortName = 'comments';

module.exports = {

    async receive(context) {

        const generateOutputPortOptions = context.properties.generateOutputPortOptions;
        const { taskId, outputType } = context.messages.in.content;

        if (generateOutputPortOptions) {
            return this.getOutputPortOptions(context, outputType);
        }

        if (!taskId) {
            throw new context.CancelError('Task ID is required');
        }

        const cu = new ClickUpClient(context);
        const response = await cu.request('GET', `/task/${taskId}/comment`);
        const comments = response?.comments || [];

        if (comments.length === 0) {
            return context.sendJson({}, 'notFound');
        }

        if (outputType === 'first') {
            return context.sendJson(comments[0], outputPortName);
        } else if (outputType === 'object') {
            return context.sendArray(comments, outputPortName);
        } else if (outputType === 'array') {
            return context.sendJson({ comments }, outputPortName);
        } else if (outputType === 'file') {
            const headers = Object.keys(comments[0] || {});
            const csvRows = [headers.join(',')];
            for (const record of comments) {
                const values = headers.map(header => {
                    let val = record[header];
                    if (val && typeof val === 'object') {
                        val = JSON.stringify(val);
                    }
                    return `"${val}"`;
                });
                csvRows.push(values.join(','));
            }
            const buffer = Buffer.from(csvRows.join('\n'), 'utf8');
            const componentName = context.flowDescriptor[context.componentId].label || context.componentId;
            const fileName = `${context.config.outputFilePrefix || 'clickup-comments'}-${componentName}.csv`;
            const savedFile = await context.saveFileStream(fileName, buffer);
            return context.sendJson({ fileId: savedFile.fileId }, outputPortName);
        }

        // Default to array output.
        return context.sendJson({ comments }, outputPortName);
    },

    getOutputPortOptions(context, outputType) {

        const commentProps = {
            id: { type: 'string', title: 'Comment ID' },
            comment_text: { type: 'string', title: 'Comment Text' },
            'user.id': { type: 'number', title: 'User ID' },
            'user.username': { type: 'string', title: 'Username' },
            'user.email': { type: 'string', title: 'User Email' },
            resolved: { type: 'boolean', title: 'Resolved' },
            date: { type: 'string', title: 'Date' }
        };

        if (outputType === 'object' || outputType === 'first') {
            return context.sendJson(
                Object.entries(commentProps).map(([value, def]) => ({ label: def.title, value, schema: { type: def.type } })),
                outputPortName
            );
        } else if (outputType === 'array') {
            return context.sendJson([
                {
                    label: 'Comments',
                    value: 'comments',
                    schema: {
                        type: 'array',
                        items: { type: 'object', properties: commentProps }
                    }
                }
            ], outputPortName);
        } else if (outputType === 'file') {
            return context.sendJson([{ label: 'File ID', value: 'fileId' }], outputPortName);
        }
        return context.sendJson([], outputPortName);
    }
};
