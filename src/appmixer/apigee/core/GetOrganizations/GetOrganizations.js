
const lib = require('../../lib.generated');
const schema = {"name":{"type":"string","title":"Name"},"displayName":{"type":"string","title":"Display Name"},"description":{"type":"string","title":"Description"},"createdAt":{"type":"string","title":"Created At"},"lastModifiedAt":{"type":"string","title":"Last Modified At"},"properties":{"type":"object","properties":{"property1":{"type":"string","title":"Properties.Property1"},"property2":{"type":"string","title":"Properties.Property2"}},"title":"Properties"},"analyticsRegion":{"type":"string","title":"Analytics Region"},"runtimeType":{"type":"string","title":"Runtime Type"},"subscriptionType":{"type":"string","title":"Subscription Type"},"projectId":{"type":"string","title":"Project Id"}}

module.exports = {
    async receive(context) {        
        const { parent, outputType } = context.messages.in.content;

if (context.properties.generateOutputPortOptions) {
        return lib.getOutputPortOptions(context, outputType, schema, { label: 'organizations', value: 'organizations' });
    }

// https://cloud.google.com/apigee/docs/reference/apis/apigee/rest/v1/organizations/list
    const { data } = await lib.callEndpoint(context, { method: 'GET', action: 'https://apigee.googleapis.com/v1/organizations' });

return lib.sendArrayOutput({ context, records, outputType, arrayPropertyValue: 'organizations' })
    }
};
