'use strict';

module.exports = {

    rules: [
        {
            // GetResponse API rate limit: 30,000 requests per minute
            // We set a conservative limit
            limit: 1000,
            window: 1000 * 60, // 1 minute
            throttling: 'window-sliding',
            queueing: 'fifo',
            resource: 'requests'
        }
    ]
};
