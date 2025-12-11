'use strict';

const ZohoClient = require('../../ZohoClient');

module.exports = {

    async receive(context) {

        const {
            moduleName,
            singularLabel,
            pluralLabel,
            description,
            enableRecordDuplicateCheck,
            enableApprovalWorkflow,
            enableWebForm
        } = context.messages.in.content;

        if (!moduleName) {
            throw new context.CancelError('Module Name is required!');
        }

        if (!singularLabel) {
            throw new context.CancelError('Singular Label is required!');
        }

        if (!pluralLabel) {
            throw new context.CancelError('Plural Label is required!');
        }

        // ZohoClient will use context.profileInfo.region which is set by auth.js
        const zc = new ZohoClient(context);

        const requestBody = {
            modules: [
                {
                    apiName: moduleName,
                    singularLabel,
                    pluralLabel,
                    channels: [
                        {
                            name: 'web'
                        }
                    ]
                }
            ]
        };

        if (description) {
            requestBody.modules[0].description = description;
        }

        const moduleSettings = {};
        if (enableRecordDuplicateCheck !== undefined && enableRecordDuplicateCheck !== null) {
            moduleSettings.enableRecordDuplicateCheck = enableRecordDuplicateCheck;
        }
        if (enableApprovalWorkflow !== undefined && enableApprovalWorkflow !== null) {
            moduleSettings.enableApprovalWorkflow = enableApprovalWorkflow;
        }
        if (enableWebForm !== undefined && enableWebForm !== null) {
            moduleSettings.enableWebForm = enableWebForm;
        }

        if (Object.keys(moduleSettings).length > 0) {
            requestBody.modules[0].moduleSettings = moduleSettings;
        }

        const response = await zc.request('POST', '/crm/v8/settings/modules', {
            data: requestBody
        });

        const module = response.modules && response.modules[0] ? response.modules[0] : {};

        return context.sendJson({
            moduleId: module.id,
            apiName: module.apiName,
            singularLabel: module.singularLabel,
            pluralLabel: module.pluralLabel,
            description: module.description,
            createdTime: module.createdTime,
            status: 'created'
        }, 'out');
    }
};
