'use strict';

const TODOIST_COLORS = [
    { label: 'Berry Red', value: 'berry_red' },
    { label: 'Red', value: 'red' },
    { label: 'Orange', value: 'orange' },
    { label: 'Yellow', value: 'yellow' },
    { label: 'Olive Green', value: 'olive_green' },
    { label: 'Lime Green', value: 'lime_green' },
    { label: 'Green', value: 'green' },
    { label: 'Mint Green', value: 'mint_green' },
    { label: 'Teal', value: 'teal' },
    { label: 'Sky Blue', value: 'sky_blue' },
    { label: 'Light Blue', value: 'light_blue' },
    { label: 'Blue', value: 'blue' },
    { label: 'Grape', value: 'grape' },
    { label: 'Violet', value: 'violet' },
    { label: 'Lavender', value: 'lavender' },
    { label: 'Magenta', value: 'magenta' },
    { label: 'Salmon', value: 'salmon' },
    { label: 'Charcoal', value: 'charcoal' },
    { label: 'Grey', value: 'grey' },
    { label: 'Taupe', value: 'taupe' }
];

const PRIORITY_OPTIONS = [
    { label: 'Priority 1 (Highest)', value: 4 },
    { label: 'Priority 2', value: 3 },
    { label: 'Priority 3', value: 2 },
    { label: 'Priority 4 (Lowest)', value: 1 }
];

module.exports = {

    TODOIST_COLORS,

    PRIORITY_OPTIONS,

    async apiRequest(context, endpoint, options = {}) {

        const { method = 'GET', data, params } = options;

        const requestOptions = {
            method,
            url: `https://api.todoist.com/rest/v2${endpoint}`,
            headers: {
                'Authorization': `Bearer ${context.auth.accessToken}`,
                'Content-Type': 'application/json'
            }
        };

        if (data) {
            requestOptions.data = data;
        }

        if (params) {
            requestOptions.params = params;
        }

        const response = await context.httpRequest(requestOptions);
        return response.data;
    },

    async syncApiRequest(context, commands) {

        const response = await context.httpRequest({
            method: 'POST',
            url: 'https://api.todoist.com/sync/v9/sync',
            headers: {
                'Authorization': `Bearer ${context.auth.accessToken}`,
                'Content-Type': 'application/json'
            },
            data: {
                commands
            }
        });
        return response.data;
    },

    getOutputPortOptions(portsToSkip = []) {

        const ports = [
            { label: 'First', value: 'first' },
            { label: 'Array', value: 'array' },
            { label: 'Object', value: 'object' },
            { label: 'File', value: 'file' }
        ];

        return ports.filter(port => !portsToSkip.includes(port.value));
    },

    async sendArrayOutput({ context, outputType = 'first', records = [], filesInfo }) {

        if (outputType === 'first') {
            if (records.length > 0) {
                return context.sendJson(records[0], 'out');
            }
        } else if (outputType === 'object') {
            for (const record of records) {
                await context.sendJson(record, 'out');
            }
        } else if (outputType === 'array') {
            return context.sendJson({ records }, 'out');
        } else if (outputType === 'file') {
            const content = JSON.stringify(records, null, 2);
            const savedFile = await context.saveFileStream(
                filesInfo?.filename || 'records.json',
                Buffer.from(content)
            );
            return context.sendJson({ fileId: savedFile.fileId }, 'out');
        }
    }
};
