'use strict';

module.exports = {

    labelsToSelectArray(labels) {

        return (labels || []).map(label => ({
            label: label.name,
            value: label.id.toString()
        }));
    }
};
