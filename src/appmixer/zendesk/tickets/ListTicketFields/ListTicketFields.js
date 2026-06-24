'use strict';

module.exports = {

    receive: async function(context) {

        if (context.properties.generateOutputPortOptions) {
            return this.getOutputPortOptions(context);
        }

        const { outputType } = context.messages.in.content;
        const headers = {
            Authorization: 'Bearer ' + context.auth.accessToken
        };

        let url = `https://${context.auth.subdomain}.zendesk.com/api/v2/ticket_fields.json`;
        const fields = [];
        while (url) {
            const { data } = await context.httpRequest({ url, method: 'GET', headers });
            fields.push(...(data.ticket_fields || []));
            url = data.next_page || null;
        }
        const count = fields.length;

        if (outputType === 'first') {
            // First item only.
            if (fields.length > 0) {
                return context.sendJson({ field: fields[0], index: 0, count }, 'out');
            }
        } else if (outputType === 'object') {
            // One by one.
            for (let index = 0; index < fields.length; index++) {
                await context.sendJson({ field: fields[index], index, count }, 'out');
            }
        } else if (outputType === 'array') {
            // All at once.
            return context.sendJson({ items: fields, count }, 'out');
        } else if (outputType === 'file') {
            // Into CSV file.
            const firstItem = fields[0] || {};
            const csvHeaders = Object.keys(firstItem);
            const csvRows = [csvHeaders.join(',')];
            for (const field of fields) {
                const values = csvHeaders.map(header => {
                    let val = field[header];
                    if (val && typeof val === 'object') {
                        val = JSON.stringify(val);
                    }
                    return `"${val}"`;
                });
                csvRows.push(values.join(','));
            }
            const buffer = Buffer.from(csvRows.join('\n'), 'utf8');
            const savedFile = await context.saveFileStream(`zendesk-ticket-fields-${(new Date).toISOString()}.csv`, buffer);
            return context.sendJson({ fileId: savedFile.fileId, count }, 'out');
        } else {
            throw new context.CancelError('Unsupported outputType ' + outputType);
        }
    },

    getOutputPortOptions(context) {

        const { outputType } = context.messages.in.content;
        if (outputType === 'object' || outputType === 'first') {
            return context.sendJson([
                { label: 'Current Item Index', value: 'index', schema: { type: 'integer' } },
                { label: 'Items Count', value: 'count', schema: { type: 'integer' } },
                { label: 'Ticket Field', value: 'field', schema: this.fieldSchema }
            ], 'out');
        } else if (outputType === 'array') {
            return context.sendJson([
                { label: 'Items Count', value: 'count', schema: { type: 'integer' } },
                { label: 'Items', value: 'items', schema: { type: 'array', items: this.fieldSchema } }
            ], 'out');
        } else {        // file
            return context.sendJson([
                { label: 'Items Count', value: 'count', schema: { type: 'integer' } },
                { label: 'File ID', value: 'fileId', schema: { type: 'string', format: 'appmixer-file-id' } }
            ], 'out');
        }
    },

    fieldSchema: {
        type: 'object',
        properties: {
            id: { type: 'integer', title: 'ID', example: 34567 },
            type: { type: 'string', title: 'Type', example: 'subject' },
            title: { type: 'string', title: 'Title', example: 'Subject' },
            raw_title: { type: 'string', title: 'Raw Title', example: 'Subject' },
            description: { type: 'string', title: 'Description', example: 'The subject of the ticket' },
            active: { type: 'boolean', title: 'Active', example: true },
            required: { type: 'boolean', title: 'Required', example: true },
            position: { type: 'integer', title: 'Position', example: 1 },
            created_at: { type: 'string', format: 'date-time', title: 'Created At', example: '2024-01-15T09:30:00Z' },
            updated_at: { type: 'string', format: 'date-time', title: 'Updated At', example: '2024-01-16T09:30:00Z' },
            url: { type: 'string', title: 'URL', example: 'https://example.zendesk.com/api/v2/ticket_fields/34567.json' }
        }
    }
};
