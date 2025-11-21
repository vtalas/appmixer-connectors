'use strict';

/**
 * OnStart component reacts on the 'start' message only. It triggers when the flow starts.
 * @extends {Component}
 */
module.exports = {

    async receive(context) {

        const { variables } = context.messages.in.content;

        await context.log({ 'step': '', variables });

        const code = `
        const fullName = $data.firstName + ' ' + $data.lastName;
        fullName.toUpperCase();   `;

        const result = context.evalJavaScript(code, {
            firstName: 'John',
            lastName: 'Doe'
        });

        await context.log({ 'step': 'resutl',result });
        return context.sendJson({ result }, 'out');
    }
};
