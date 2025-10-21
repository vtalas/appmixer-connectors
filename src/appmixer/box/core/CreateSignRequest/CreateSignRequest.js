'use strict';

module.exports = {

    async receive(context) {

        const {
            sourceFileId,
            signerEmail,
            signerRole,
            signerOrder,
            signerIsInPerson,
            parentFolderId,
            message,
            subject,
            redirectUrl,
            declinedRedirectUrl
        } = context.messages.in.content;

        // Validate required fields
        if (!sourceFileId) {
            throw new context.CancelError('Source File ID is required!');
        }
        if (!signerEmail) {
            throw new context.CancelError('Signer Email is required!');
        }

        // Build the request body according to Box API specification
        const requestBody = {
            source_files: [
                {
                    type: 'file',
                    id: sourceFileId
                }
            ],
            signers: [
                {
                    email: signerEmail,
                    role: signerRole || 'signer'
                }
            ]
        };

        // Add optional signer properties
        if (signerOrder !== undefined && signerOrder !== null) {
            requestBody.signers[0].order = signerOrder;
        }
        if (signerIsInPerson !== undefined && signerIsInPerson !== null) {
            requestBody.signers[0].is_in_person = signerIsInPerson;
        }

        // Add optional parent folder
        if (parentFolderId) {
            requestBody.parent_folder = {
                type: 'folder',
                id: parentFolderId
            };
        }

        // Add optional message fields
        if (message) {
            requestBody.message = message;
        }
        if (subject) {
            requestBody.subject = subject;
        }
        if (redirectUrl) {
            requestBody.redirect_url = redirectUrl;
        }
        if (declinedRedirectUrl) {
            requestBody.declined_redirect_url = declinedRedirectUrl;
        }

        // Make the API request
        // https://developer.box.com/reference/post-sign-requests/
        const { data } = await context.httpRequest({
            method: 'POST',
            url: 'https://api.box.com/2.0/sign_requests',
            headers: {
                'Authorization': `Bearer ${context.auth.accessToken}`,
                'Content-Type': 'application/json'
            },
            data: requestBody
        });

        return context.sendJson(data, 'out');
    }
};
