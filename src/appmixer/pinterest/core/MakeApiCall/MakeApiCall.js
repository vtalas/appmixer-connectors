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

        const requestOptions = {
            method: method,
            url: url,
            headers: {
                'Authorization': `Bearer ${context.auth.accessToken}`,
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

        await context.sendJson({
            status: response.status,
            headers: response.headers,
            body: response.data
        }, 'out');
    }
};
