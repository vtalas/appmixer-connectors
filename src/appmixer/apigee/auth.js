'use strict';

module.exports = {
    type: 'oauth2',

    definition: initData => {

        return {
            connectAccountButton: { image: 'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz48IS0tIFVwbG9hZGVkIHRvOiBTVkcgUmVwbywgd3d3LnN2Z3JlcG8uY29tLCBHZW5lcmF0b3I6IFNWRyBSZXBvIE1peGVyIFRvb2xzIC0tPgo8c3ZnIHdpZHRoPSI4MDBweCIgaGVpZ2h0PSI4MDBweCIgdmlld0JveD0iMCAwIDI0IDI0IiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgoNPGRlZnM+Cg08c3R5bGU+LmNscy0xe2ZpbGw6IzY2OWRmNjt9LmNscy0xLC5jbHMtMntmaWxsLXJ1bGU6ZXZlbm9kZDt9LmNscy0ye2ZpbGw6IzQyODVmNDt9PC9zdHlsZT4KDTwvZGVmcz4KDTx0aXRsZT5JY29uXzI0cHhfQXBwaWdlZUFQSVBsYXRmb3JtX0NvbG9yPC90aXRsZT4KDTxnIGRhdGEtbmFtZT0iUHJvZHVjdCBJY29ucyI+Cg08ZyA+Cg08ZyA+Cg08cGF0aCBpZD0iRmlsbC0xIiBjbGFzcz0iY2xzLTEiIGQ9Ik01LjIsMTJsMS4zMi0xLjMyTDQuNzMsOC44OWEyLjk0LDIuOTQsMCwwLDEsMi4wOC01LDIuOTIsMi45MiwwLDAsMSwyLjA3Ljg2bDEuOCwxLjc5TDEyLDUuMiwxMC4yMSwzLjQxYTQuODEsNC44MSwwLDEsMC02LjgsNi44WiIvPgoNPHBhdGggaWQ9IkZpbGwtMyIgY2xhc3M9ImNscy0xIiBkPSJNMTguOCwxMmwtMS4zMiwxLjMyLDEuNzksMS44YTIuOTQsMi45NCwwLDAsMS00LjE2LDQuMTVsLTEuNzktMS43OUwxMiwxOC44bDEuNzksMS43OWE0LjgxLDQuODEsMCwxLDAsNi44LTYuOFoiLz4KDTxnID4KDTxwYXRoIGlkPSJGaWxsLTUiIGNsYXNzPSJjbHMtMiIgZD0iTTguODksMTkuMjdhMi45NCwyLjk0LDAsMCwxLTQuMTYtNC4xNmwxLjc5LTEuNzksNC4xNiw0LjE2Wk0xNS4xMiw0LjczYTIuOTMsMi45MywwLDAsMSw1LDIuMDgsMywzLDAsMCwxLS44NiwyLjA4bC0xLjc5LDEuNzlMMTMuMzIsNi41MlpNMTIsMTUuMTlBMy4yLDMuMiwwLDAsMSw4LjgxLDEyaDBBMy4yMSwzLjIxLDAsMCwxLDEyLDguODFoMEEzLjIxLDMuMjEsMCwwLDEsMTUuMTksMTJoMEEzLjIsMy4yLDAsMCwxLDEyLDE1LjE5Wk0xOC44LDEybDEuNzktMS43OWE0LjgxLDQuODEsMCwxLDAtNi44LTYuOEwxMiw1LjIsNS4yLDEyLDMuNDEsMTMuNzlhNC44MSw0LjgxLDAsMSwwLDYuOCw2LjhMMTIsMTguOFoiLz4KDTwvZz4KDTwvZz4KDTwvZz4KDTwvZz4KDTwvc3ZnPg==' },

            clientId: initData.clientId,
            clientSecret: initData.clientSecret,

            scope: ['profile', 'email'],

            accountNameFromProfileInfo: function(context) {
                return context.profileInfo.email;
            },

            emailFromProfileInfo: function(context) {
                return context.profileInfo.email;
            },

            authUrl: function(context) {
                const params = new URLSearchParams({
                    client_id: initData.clientId,
                    redirect_uri: context.callbackUrl,
                    response_type: 'code',
                    scope: context.scope.join(' '),
                    state: context.ticket,
                    access_type: 'offline',
                    approval_prompt: 'force'
                }).toString();

                return `https://accounts.google.com/o/oauth2/auth?${params}`;
            },

            requestProfileInfo: async function(context) {
                const response = await context.httpRequest({
                    method: 'GET',
                    url: 'https://www.googleapis.com/oauth2/v2/userinfo',
                    headers: {
                        Authorization: `Bearer ${context.accessToken}`
                    }
                });

                if (!response.data) {
                    throw new Error('Failed to retrieve profile info');
                }

                return response.data;
            },

            requestAccessToken: async function(context) {

                const data = {
                    code: context.authorizationCode,
                    client_id: initData.clientId,
                    client_secret: initData.clientSecret,
                    redirect_uri: context.callbackUrl,
                    grant_type: 'authorization_code'
                };

                const response = await context.httpRequest({
                    method: 'POST',
                    url: 'https://oauth2.googleapis.com/token',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    },
                    data
                });

                return {
                    accessToken: response.data.access_token,
                    accessTokenExpDate: new Date(Date.now() + response.data.expires_in * 1000),
                    refreshToken: response.data.refresh_token
                };
            },

            refreshAccessToken: async function(context) {

                const data = {
                    client_id: initData.clientId,
                    client_secret: initData.clientSecret,
                    refresh_token: context.refreshToken,
                    grant_type: 'refresh_token'
                };

                const response = await context.httpRequest({
                    method: 'POST',
                    url: 'https://oauth2.googleapis.com/token',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    },
                    data
                });

                return {
                    accessToken: response.data.access_token,
                    accessTokenExpDate: new Date(Date.now() + response.data.expires_in * 1000)
                };
            },

            validateAccessToken: async function(context) {
                const response = await context.httpRequest({
                    method: 'GET',
                    url: 'https://www.googleapis.com/oauth2/v2/tokeninfo',
                    params: {
                        access_token: context.accessToken
                    }
                });

                if (response.data.expires_in) {
                    return response.data.expires_in;
                } else {
                    throw new Error('Token validation failed.');
                }
            }
        };
    }
};
