'use strict';

module.exports = {
    async receive(context) {
        const {
            name, entityType, scheduledStartTime, scheduledEndTime,
            channelId, location, description
        } = context.messages.in.content;

        if (!name) {
            throw new context.CancelError('Event name is required');
        }
        if (!entityType) {
            throw new context.CancelError('Entity type is required');
        }
        if (!scheduledStartTime) {
            throw new context.CancelError('Scheduled start time is required');
        }

        const type = Number(entityType);

        const body = {
            name,
            privacy_level: 2, // GUILD_ONLY — the only value Discord supports
            entity_type: type,
            scheduled_start_time: scheduledStartTime
        };

        if (description) {
            body.description = description;
        }
        if (scheduledEndTime) {
            body.scheduled_end_time = scheduledEndTime;
        }

        if (type === 3) {
            // EXTERNAL — location and end time are required
            if (!location) {
                throw new context.CancelError('Location is required for external events');
            }
            if (!scheduledEndTime) {
                throw new context.CancelError('Scheduled end time is required for external events');
            }
            body.entity_metadata = { location };
        } else {
            // STAGE_INSTANCE (1) or VOICE (2) — channel is required
            if (!channelId) {
                throw new context.CancelError('Channel ID is required for stage/voice events');
            }
            body.channel_id = channelId;
        }

        // https://discord.com/developers/docs/resources/guild-scheduled-event#create-guild-scheduled-event
        const { data } = await context.httpRequest({
            method: 'POST',
            url: `https://discord.com/api/v10/guilds/${context.auth.profileInfo.guildId}/scheduled-events`,
            headers: {
                'Authorization': `Bot ${context.config.botToken}`
            },
            data: body
        });

        return context.sendJson(data, 'out');
    }
};
