'use strict';
const commons = require('../../asana-commons');

/**
 * Component for fetching the subtasks of a task.
 * @extends {Component}
 */
module.exports = {

    receive(context) {

        const generateOutputPortOptions = context.properties.generateOutputPortOptions;
        const { taskId, outputType } = context.messages.in.content;

        if (generateOutputPortOptions) {
            return this.getOutputPortOptions(context, outputType);
        }

        if (!taskId) {
            throw new context.CancelError('Task ID is required');
        }

        const client = commons.getAsanaAPI(context.auth.accessToken);

        return client.tasks.subtasks(taskId)
            .then(res => {
                return commons.sendArrayOutput({
                    context,
                    outputPortName: 'subtasks',
                    outputType,
                    records: res.data
                });
            });
    },

    getOutputPortOptions(context, outputType) {

        if (outputType === 'item') {
            return context.sendJson(
                [
                    { label: 'gid', value: 'gid' },
                    { label: 'Name', value: 'name' },
                    { label: 'Resource type', value: 'resource_type' },
                    { label: 'Resource sub type', value: 'resource_subtype' }
                ],
                'subtasks'
            );
        } else if (outputType === 'items') {
            return context.sendJson(
                [
                    {
                        label: 'Subtasks',
                        value: 'items',
                        schema: {
                            type: 'array',
                            items: {
                                type: 'object',
                                properties: {
                                    'gid': { title: 'gid', type: 'string' },
                                    'name': { title: 'Name', type: 'string' },
                                    'resource_type': { title: 'Resource type', type: 'string' },
                                    'resource_subtype': { title: 'Resource sub type', type: 'string' }
                                }
                            }
                        }
                    }
                ],
                'subtasks'
            );
        } else {
            // file
            return context.sendJson([{ label: 'File ID', value: 'fileId' }], 'subtasks');
        }
    }
};
