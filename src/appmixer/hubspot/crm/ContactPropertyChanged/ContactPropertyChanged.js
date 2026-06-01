'use strict';
const BaseSubscriptionComponent = require('../../BaseSubscriptionComponent');
const { getObjectProperties } = require('../../commons');

const subscriptionType = 'contact.propertyChange';

class ContactPropertyChanged extends BaseSubscriptionComponent {

    async start(context) {

        this.configureHubspot(context);

        await this.ensureWebhook(context);

        const portalId = context.auth?.profileInfo?.hub_id;
        const propertyName = context.properties.propertyName;

        // Pass propertyName in listener params so routes.js can ensure a subscription exists for it.
        return context.addListener(`${subscriptionType}:${portalId}`, {
            apiKey: context.config.apiKey,
            appId: context.config.appId,
            propertyName
        });
    }

    async receive(context) {

        this.configureHubspot(context);

        const eventsByObjectId = context.messages.webhook.content.data;
        const watchedProperty = context.properties.propertyName;

        let matchingContactIds = [];
        let lock;

        try {
            lock = await context.lock(context.componentId, {
                ttl: 1000 * 10,
                retryDelay: 500,
                maxRetryCount: 3
            });

            for (const [contactId, event] of Object.entries(eventsByObjectId)) {
                // Only process events for the configured property.
                if (event.propertyName && event.propertyName !== watchedProperty) {
                    continue;
                }
                const cacheKey = `hubspot-contact-prop-changed-${watchedProperty}-${contactId}`;
                const cached = await context.staticCache.get(cacheKey);
                if (cached && event.occurredAt <= cached) {
                    continue;
                }
                await context.staticCache.set(cacheKey, event.occurredAt, context.config?.eventCacheTTL || 5000);
                matchingContactIds.push(contactId);
            }
        } finally {
            await lock?.unlock();
        }

        if (!matchingContactIds.length) {
            return context.response();
        }

        let propertiesToReturn;
        const { properties } = context.properties;
        if (!properties) {
            propertiesToReturn = await getObjectProperties(context, this.hubspot, 'contacts', 'names');
        } else {
            propertiesToReturn = properties.split(',');
        }

        const { data } = await this.hubspot.call('post', 'crm/v3/objects/contacts/batch/read', {
            inputs: matchingContactIds.map((id) => ({ id })),
            properties: propertiesToReturn
        });

        await context.sendArray(data.results, 'contact');

        return context.response();
    }
}

module.exports = new ContactPropertyChanged(subscriptionType);
