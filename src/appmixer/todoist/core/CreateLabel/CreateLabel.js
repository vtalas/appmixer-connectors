'use strict';

const lib = require('../../lib');

module.exports = {

    async receive(context) {

        const { name, order, color, isFavorite } = context.messages.in.content;

        const body = { name };

        if (order !== undefined) body.order = order;
        if (color) body.color = color;
        if (isFavorite !== undefined) body.is_favorite = isFavorite;

        const label = await lib.apiRequest(context, '/labels', {
            method: 'POST',
            data: body
        });

        return context.sendJson(label, 'out');
    }
};
