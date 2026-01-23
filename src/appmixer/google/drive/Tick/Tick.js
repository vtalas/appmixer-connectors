module.exports = {

    async start(context) {

        await context.saveState({
            expirationTime: Date.now() + 60 * 54 * 1000
        });

    },

    stop(context) {

    },

    async receive(context) {

        return context.response();
    },

    async tick(context) {

        const { accessToken } = context.auth;
        const state = await context.loadState();
        const { expirationTime } = state;
        const now = Date.now();

        if (now >= expirationTime) {
            await context.log({
                'step': 'token info ' + accessToken.substr(accessToken.length - 10),
                expirationTime: new Date(expirationTime),
                a: context.auth
            });

            await context.saveState({
                expirationTime: Date.now() + 60 * 54 * 1000
            });
        }

    }
};
