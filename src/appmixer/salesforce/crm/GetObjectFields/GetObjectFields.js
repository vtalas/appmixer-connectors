const commons = require('../salesforce-commons');

module.exports = {

    async receive(context) {

        const {
            objectName
        } = context.messages.in.content;

        const fields = await commons.api.getObjectFields(context, { objectName });

        return context.sendJson({
            fields
        }, 'out');
    }
};
