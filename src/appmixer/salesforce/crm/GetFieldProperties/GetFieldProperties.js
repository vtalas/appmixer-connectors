const commons = require('../lib');

module.exports = {

    async receive(context) {

        const {
            objectName,
            fieldName = ''
        } = context.messages.in.content;

        const fields = await commons.api.getObjectFields(context, { objectName });

        const stageNameField = fields.find(field => field.name === fieldName);

        if (!stageNameField) {
            return context.sendJson({}, 'notFound');
        }

        return context.sendJson(stageNameField, 'out');
    }
};
