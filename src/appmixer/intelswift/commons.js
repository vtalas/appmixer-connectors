module.exports = {

    async makeRequest(context, endpoint, { method = 'POST', params = {}, data = null, headers = {} } = {}) {

        const BASE_URL = context.config.BASE_URL || 'https://stage-app.intelswift.com';
        
        // const apiKey = context.customFields?.apiKey;
        // if (!apiKey) throw 'Token not found in customFields';


        // const BASE_URL = 'https://lhh58pkt-80.inc1.devtunnels.ms';
        const ACCESS_KEY = "appmixer-marketplace-secret-token-12345!@#";

        const options = {
            method,
            url: `${BASE_URL}${endpoint}`,
            headers,
            data: {
                api_key: `${context.apiKey}`,
                ...data,
                appSecret: ACCESS_KEY,
                customFields: context.customFields
            },
            params
        };

        return await context.httpRequest(options);
    }
};

