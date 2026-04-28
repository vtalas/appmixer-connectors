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

        const baseUrl = 'https://verifyemail.io/api';
        const targetUrl = url.startsWith('http://') || url.startsWith('https://')
            ? url
            : `${baseUrl}${url}`;

        const requestOptions = {
            method,
            url: targetUrl,
            // API key is always passed as a query parameter; user params are merged in
            params: { apikey: context.auth.apiKey, ...queryParams },
            headers: {
                'Content-Type': 'application/json',
                ...extraHeaders
            }
        };

        if (Object.keys(bodyData).length > 0) {
            requestOptions.data = bodyData;
        }

        const response = await context.httpRequest(requestOptions);

        return context.sendJson({
            status: response.status,
            headers: response.headers,
            body: response.data
        }, 'out');
    }
};
