const commons = require('../lib');

module.exports = {

    async receive(context) {

        const { objectName, fieldName } = context.messages.in.content;

        const fields = await commons.api.getObjectFields(context, { objectName });

        if (fieldName) {
            const singleField = fields.find(field => field.name === fieldName);
            if (singleField) {
                return context.sendJson({ fields: [singleField] }, 'out');
            }
        }

        context.log({ step: 'field 0 ', field: fields[0] });

        return context.sendJson({ fields }, 'out');
    }
};
