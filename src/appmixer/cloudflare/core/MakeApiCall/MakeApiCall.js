'use strict';

function kvToObj(arr) {
    if (!arr || !Array.isArray(arr)) return {};
    return Object.fromEntries(arr.map(({ key, value }) => [key, value]));
}


module.exports = {
    async receive(context) {

        const { url, method, headers: headersKV, parameters: parametersKV, body: bodyKV } = context.messages.in.content;

        const extraHeaders = kvToObj(headersKV);
        const queryParams = kvToObj(parametersKV);
        const bodyData = kvToObj(bodyKV);

        if (!url) {
            throw new context.CancelError('API Endpoint URL is required!');
        }
        if (!method) {
            throw new context.CancelError('HTTP Method is required!');
        }

        const baseUrl = 'https://api.cloudflare.com/client/v4';
        const targetUrl = url.startsWith('http://') || url.startsWith('https://')
            ? url
            : `${baseUrl}${url}`;

        const authHeaders = context.auth.email
            ? { 'X-Auth-Email': context.auth.email, 'X-Auth-Key': context.auth.apiKey }
            : { 'Authorization': `Bearer ${context.auth.apiKey}` };

        const requestOptions = {
            method,
            url: targetUrl,
            headers: {
                ...authHeaders,
                'Content-Type': 'application/json',
                ...extraHeaders
            }
        };

        if (Object.keys(bodyData).length > 0) {
            requestOptions.data = bodyData;
        }

        if (Object.keys(queryParams).length > 0) {
            requestOptions.params = queryParams;
        }

        const response = await context.httpRequest(requestOptions);

        return context.sendJson({
            status: response.status,
            headers: response.headers,
            body: response.data
        }, 'out');
    }
};
