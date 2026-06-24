'use strict';
const commons = require('../lib');

/**
 * Build task.
 * @param {Object} task
 * @return {Object} taskObject
 */
function buildTask(task) {

    const taskObject = {
        Subject: task.subject
    };

    if (task['status']) {
        taskObject['Status'] = task['status'];
    }
    if (task['priority']) {
        taskObject['Priority'] = task['priority'];
    }
    if (task['activityDate']) {
        taskObject['ActivityDate'] = task['activityDate'];
    }
    if (task['whoId']) {
        taskObject['WhoId'] = task['whoId'];
    }
    if (task['whatId']) {
        taskObject['WhatId'] = task['whatId'];
    }
    if (task['ownerId']) {
        taskObject['OwnerId'] = task['ownerId'];
    }
    if (task['description']) {
        taskObject['Description'] = task['description'];
    }

    return taskObject;
}

/**
 * Create new task in Salesforce.
 * @extends {Component}
 */
module.exports = {

    receive(context) {

        const task = context.messages.task.content;

        if (!task.subject) {
            throw new context.CancelError('Subject is required');
        }

        const client = commons.getSalesforceAPI(context);
        const taskObject = buildTask(task);

        return client.sobject('Task').create(taskObject)
            .then(result => client.sobject('Task').retrieve(result['id']))
            .then(result => context.sendJson(result, 'newTask'));
    }
};
