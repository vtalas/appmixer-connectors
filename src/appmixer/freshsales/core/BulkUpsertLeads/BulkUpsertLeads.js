'use strict';

module.exports = {

    async receive(context) {

        const {
            identifierType,
            identifierId,
            identifierEmails,
            leadsData
        } = context.messages.in.content;

        if (!leadsData) {
            throw new context.CancelError('Leads Data is required!');
        }

        // Validate identifier is provided
        if (!identifierType) {
            throw new context.CancelError('Identifier Type is required!');
        }

        if (identifierType === 'id' && !identifierId) {
            throw new context.CancelError('Lead ID is required when using ID identifier type!');
        }

        if (identifierType === 'email' && (!identifierEmails || identifierEmails.length === 0)) {
            throw new context.CancelError('At least one email is required when using email identifier type!');
        }

        // Parse leadsData if it's a string (from textarea)
        let parsedLeadsData = leadsData;
        if (typeof leadsData === 'string') {
            try {
                parsedLeadsData = JSON.parse(leadsData);
            } catch (err) {
                throw new context.CancelError('Leads Data must be valid JSON!');
            }
        }

        // Build identifier object based on type
        const identifier = {};
        if (identifierType === 'id') {
            identifier.id = identifierId;
        } else if (identifierType === 'email') {
            identifier.emails = identifierEmails;
        }

        const url = `https://${context.auth.domain}/api/leads/bulk_upsert`;
        const headers = {
            'Authorization': `Token token=${context.auth.apiKey}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        };

        const response = await context.httpRequest({
            method: 'POST',
            url,
            headers,
            data: {
                leads: [
                    {
                        identifier,
                        data: parsedLeadsData
                    }
                ]
            }
        });

        return context.sendJson(response.data, 'out');
    }
};
