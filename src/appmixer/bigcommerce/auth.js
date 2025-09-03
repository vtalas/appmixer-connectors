'use strict';

module.exports = {
    type: 'oauth2',

    definition: () => {
        
        return {

            scope: [
                'store_v2_orders'
                // 'store_v2_products',
                // 'store_v2_customers',
                // 'store_v2_orders_read',
                // 'store_v2_information_read',
                // 'store_webhook'
            ],

            accountNameFromProfileInfo: (context) => {
                return context.profileInfo.domain || context.profileInfo.store_name;
            },

            emailFromProfileInfo: (context) => {
                return context.profileInfo.admin_email || context.profileInfo.email;
            },

            authUrl: (context) => {
                const params = new URLSearchParams({
                    client_id: context.clientId,
                    redirect_uri: context.callbackUrl,
                    response_type: 'code',
                    scope: context.scope.join(' '),
                    state: context.ticket
                });
                return `https://login.bigcommerce.com/oauth2/authorize?${params}`;
            },

            requestAccessToken: async (context) => {
                console.log("lajsdkljasjdl");
                const response = await context.httpRequest({
                    method: 'POST',
                    url: 'https://login.bigcommerce.com/oauth2/token',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    data: {
                        client_id: context.clientId,
                        client_secret: context.clientSecret,
                        code: context.authorizationCode,
                        scope: context.scope.join(' '),
                        grant_type: 'authorization_code',
                        redirect_uri: context.callbackUrl,
                        context: context.context
                    }
                });

                const { access_token: accessToken, context: storeContext, user, owner } = response.data;
                
                // Extract store hash from context (format: stores/{store_hash})
                const storeHash = storeContext.replace('stores/', '');

                return {
                    accessToken: accessToken,
                    storeHash: storeHash,
                    context: storeContext,
                    user: user,
                    owner: owner
                };
            },

            requestProfileInfo: async (context) => {
                const url = `https://api.bigcommerce.com/stores/${context.storeHash}/v3/store`;
                const headers = {
                    'X-Auth-Token': context.accessToken,
                    'X-Auth-Client': context.clientId,
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                };

                const response = await context.httpRequest({
                    method: 'GET',
                    url,
                    headers
                });

                if (!response.data || !response.data.data) {
                    throw new Error('Failed to retrieve store profile info');
                }

                return {
                    domain: response.data.data.domain,
                    store_name: response.data.data.name,
                    admin_email: response.data.data.admin_email,
                    email: response.data.data.admin_email
                };
            },

            validateAccessToken: async (context) => {
                const url = `https://api.bigcommerce.com/stores/${context.storeHash}/v3/store`;
                const headers = {
                    'X-Auth-Token': context.accessToken,
                    'X-Auth-Client': context.clientId,
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                };

                try {
                    const response = await context.httpRequest({
                        method: 'GET',
                        url,
                        headers
                    });
                    
                    return !!(response.data && response.data.data && response.data.data.domain);
                } catch (error) {
                    return false;
                }
            }
        };
    }
};
