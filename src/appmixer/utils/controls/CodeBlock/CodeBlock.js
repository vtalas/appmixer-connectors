'use strict';

/**
 * IMPORTANT NOTES:
 *
 * 1. **NO TOP-LEVEL RETURN**: You CANNOT use 'return' at the top level of your code!
 *    The last expression is automatically returned by evalSync().
 *    - CORRECT: '$data.value * 2'
 *    - WRONG: 'return $data.value * 2'  // Throws "Illegal return statement"
 *    - To use return statements, wrap in IIFE: '(function() { return $data.value * 2; })()'
 *
 * 2. Security: evalJavaScript runs code in an isolated environment with memory limits
 * 3. No external modules: You cannot require() modules inside the evaluated code
 * 4. No async: The evaluated code runs synchronously
 * 5. No process.exit: Calling process.exit() will throw an error
 * 6. Memory limit: Default is set by ISOLATE_MAX_MEMORY config
 * 7. Data must be JSON-serializable: The jsonData parameter must be convertible to JSON
 * 8. Return value: The last expression value is returned (or undefined if no expression)
 * 9. Multiple calls: You can call evalJavaScript multiple times in the same receive()
 * 10. Isolation: Each call creates a new context, so variables don't persist between calls
 * 11. Performance: Creating isolates has overhead, use judiciously for complex calculations
 */

/**
 * OnStart component reacts on the 'start' message only. It triggers when the flow starts.
 * @extends {Component}
 */
module.exports = {

    async receive(context) {

        const { variables, code } = context.messages.in.content;

        if (!code) {
            throw new context.CancelError('Code is required');
        }

        const variablesArray = variables?.ADD || [];

        const args = variablesArray.reduce((res, item) => {
            const { name, type, ...value } = item;
            res[name] = value[type];
            return res;
        }, {});


        await context.log({ 'step': 'variables ', args });

        const result = context.evalJavaScript(code, args);

        await context.log({ 'step': 'resutl', result });

        await context.log({ 'step': '111', result: example1_simpleArithmetic(context) });
        await context.log({ 'step': '22', result: example2_usingFunctions(context) });
        await context.log({ 'step': '33', result: example3_stringManipulation(context) });
        await context.log({ 'step': '444', result: example4_arrayOperations(context) });
        await context.log({ 'step': '555', result: example5_objectManipulation(context) });
        await context.log({ 'step': '66', result: example6_conditionalLogic(context) });
        await context.log({ 'step': '77', result: example7_dateManipulation(context) });
        await context.log({ 'step': '88', result: example8_multipleCalls(context) });
        await context.log({ 'step': '999', result: example9_jsonManipulation(context) });
        await context.log({ 'step': '10101010', result: example10_complexTransformation(context) });
        await context.log({ 'step': '10101010 X', result: JSON.parse(example10_complexTransformation(context)) });

        return context.sendJson({ result }, 'out');
    }
};

// Example 1: Simple arithmetic operation
function example1_simpleArithmetic(context) {

    const code = '$data.a + $data.b';
    const result = context.evalJavaScript(code, { a: 10, b: 20 });
    // Returns: 30
    return result;
}

// Example 2: Using functions
function example2_usingFunctions(context) {

    const code = `
        function sum(a, b) {
            return a + b;
        }
        sum($data.x, $data.y);
    `;
    const result = context.evalJavaScript(code, { x: 5, y: 15 });
    // Returns: 20
    return result;
}

// Example 3: String manipulation
function example3_stringManipulation(context) {

    const code = `
        const fullName = $data.firstName + ' ' + $data.lastName;
        fullName.toUpperCase();
    `;
    const result = context.evalJavaScript(code, {
        firstName: 'John',
        lastName: 'Doe'
    });
    // Returns: "JOHN DOE"
    return result;
}

// Example 4: Array operations
function example4_arrayOperations(context) {

    const code = `
        $data.numbers
            .filter(n => n > 10)
            .map(n => n * 2)
            .reduce((sum, n) => sum + n, 0);
    `;
    const result = context.evalJavaScript(code, {
        numbers: [5, 12, 8, 20, 15]
    });
    // Returns: 94 (12*2 + 20*2 + 15*2 = 24 + 40 + 30)
    return result;
}

// Example 5: Object manipulation
function example5_objectManipulation(context) {

    const code = `
        const user = $data.user;
        JSON.stringify({
            fullName: user.firstName + ' ' + user.lastName,
            isAdult: user.age >= 18,
            email: user.email.toLowerCase()
        });
    `;
    const result = context.evalJavaScript(code, {
        user: {
            firstName: 'Jane',
            lastName: 'Smith',
            age: 25,
            email: 'JANE.SMITH@EXAMPLE.COM'
        }
    });
    // Returns: { fullName: 'Jane Smith', isAdult: true, email: 'jane.smith@example.com' }
    return result;
}

// Example 6: Conditional logic
function example6_conditionalLogic(context) {

    const code = `
        (function() {
            const score = $data.score;
            if (score >= 90) return 'A';
            if (score >= 80) return 'B';
            if (score >= 70) return 'C';
            if (score >= 60) return 'D';
            return 'F';
        })();
    `;
    const result = context.evalJavaScript(code, { score: 85 });
    // Returns: "B"
    return result;
}

// Example 7: Date manipulation
function example7_dateManipulation(context) {

    const code = `
        const date = new Date($data.timestamp);
        JSON.stringify({
            year: date.getFullYear(),
            month: date.getMonth() + 1,
            day: date.getDate(),
            formatted: date.toISOString()
        });
    `;
    const result = context.evalJavaScript(code, {
        timestamp: '2025-11-21T10:30:00Z'
    });
    // Returns: { year: 2025, month: 11, day: 21, formatted: '2025-11-21T10:30:00.000Z' }
    return result;
}

// Example 8: Multiple calls (loop)
function example8_multipleCalls(context) {

    const code = `
        function square(n) {
            return n * n;
        }
        square($data.number);
    `;

    let sum = 0;
    for (let i = 1; i <= 5; i++) {
        const result = context.evalJavaScript(code, { number: i });
        sum += result;
    }
    // Returns: 55 (1 + 4 + 9 + 16 + 25)
    return sum;
}

// Example 9: JSON parsing and manipulation
function example9_jsonManipulation(context) {

    const code = `
        const data = JSON.parse($data.jsonString);
        data.items = data.items.filter(item => item.active);
        JSON.stringify(data);
    `;
    const result = context.evalJavaScript(code, {
        jsonString: JSON.stringify({
            items: [
                { id: 1, name: 'Item 1', active: true },
                { id: 2, name: 'Item 2', active: false },
                { id: 3, name: 'Item 3', active: true }
            ]
        })
    });
    // Returns: JSON string with only active items
    return JSON.parse(result);
}

// Example 10: Complex data transformation
function example10_complexTransformation(context) {

    const code = `
        const orders = $data.orders;
        const summary = {
            totalOrders: orders.length,
            totalAmount: 0,
            averageAmount: 0,
            maxAmount: 0,
            minAmount: Infinity
        };
        
        orders.forEach(order => {
            summary.totalAmount += order.amount;
            summary.maxAmount = Math.max(summary.maxAmount, order.amount);
            summary.minAmount = Math.min(summary.minAmount, order.amount);
        });
        
        summary.averageAmount = summary.totalAmount / summary.totalOrders;
        
        JSON.stringify(summary);
    `;

    const result = context.evalJavaScript(code, {
        orders: [
            { id: 1, amount: 150.50 },
            { id: 2, amount: 200.00 },
            { id: 3, amount: 75.25 },
            { id: 4, amount: 300.00 }
        ]
    });

    // Returns: { totalOrders: 4, totalAmount: 725.75, averageAmount: 181.4375, maxAmount: 300, minAmount: 75.25 }
    return result;
}

