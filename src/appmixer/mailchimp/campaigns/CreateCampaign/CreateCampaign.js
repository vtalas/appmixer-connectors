'use strict';
const mailchimpDriver = require('../../commons');

/**
 * Create a regular campaign in Mailchimp.
 * @extends {Component}
 */
module.exports = {

    async receive(context) {

        const { listId, subjectLine, title, fromName, replyTo } = context.messages.in.content;

        if (!listId) {
            throw new context.CancelError('List/Audience is required.');
        }
        if (!subjectLine) {
            throw new context.CancelError('Subject line is required.');
        }
        if (!fromName) {
            throw new context.CancelError('From name is required.');
        }
        if (!replyTo) {
            throw new context.CancelError('Reply-to email is required.');
        }

        const campaign = await mailchimpDriver.campaigns.createCampaign(context, {
            data: {
                type: 'regular',
                recipients: { list_id: listId },
                settings: {
                    subject_line: subjectLine,
                    title: title || subjectLine,
                    from_name: fromName,
                    reply_to: replyTo
                }
            }
        });

        return context.sendJson(campaign, 'out');
    }
};
