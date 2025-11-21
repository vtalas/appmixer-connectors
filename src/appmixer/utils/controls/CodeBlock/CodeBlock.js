'use strict';

/**
 * OnStart component reacts on the 'start' message only. It triggers when the flow starts.
 * @extends {Component}
 */
module.exports = {

    async receive(context) {

        const code = `
        
        function($data) {
            $data.number + 1000;
        }
        // function sum(a, b) 
        // {
        //     return a + b;
        // }
        //
        // console.log($data);
        // sum(parseInt($data.number), 100);
        
        `;

        // Just checking that we can call evalJavascript multiple times in receive()
        const result = context.evalJavaScript(code, { number: 11 });

        await context.log({ 'step': 'resutl', result });
        return context.sendJson({ result }, 'out');
    }
};
