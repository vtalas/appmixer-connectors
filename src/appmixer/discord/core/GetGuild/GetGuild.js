'use strict';

module.exports = {
    async receive(context) {
        const { withCounts } = context.messages.in.content;

        const params = {};
        if (withCounts) {
            params.with_counts = true;
        }

        // https://discord.com/developers/docs/resources/guild#get-guild
        const { data } = await context.httpRequest({
            method: 'GET',
            url: `https://discord.com/api/v10/guilds/${context.auth.profileInfo.guildId}`,
            headers: {
                'Authorization': `Bot ${context.config.botToken}`
            },
            params
        });

        return context.sendJson(data, 'out');
    }
};
