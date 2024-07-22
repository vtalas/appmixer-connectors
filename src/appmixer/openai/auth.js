'use strict';

const lib = require('./lib');

module.exports = {

    type: 'apiKey',

    definition: {

        auth: {
            'apiKey': {
                'name': 'API Key',
                'type': 'text',
                'tooltip': '<p>Log into your OpenAI account and find your API key.</p>'
            }
        },

        replaceVariables(context, str) {
            Object.keys(this.auth).forEach(variableName => {
                str = str.replaceAll('{' + variableName + '}', context[variableName]);
            });
            return str;
        },

        requestProfileInfo(context) {
            return {
                name: this.replaceVariables(context, '{apiKey}')
            };
        },

        accountNameFromProfileInfo: 'name',

        async validate(context) {
            const method = 'GET';
            const url = '/models';
            const baseUrl = lib.getBaseUrl(context);
            const normalizedUrl = this.replaceVariables(context, baseUrl + url);
            const options = { method: method, url: normalizedUrl };
            options.headers = {
                'Authorization': 'Bearer {apiKey}'
            };
            options.headers = JSON.parse(this.replaceVariables(context, JSON.stringify(options.headers)));
            await context.httpRequest(options);
            return true;
        }
    }
};
