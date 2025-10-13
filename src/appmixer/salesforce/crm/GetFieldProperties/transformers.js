'use strict';

module.exports.picklistValuesToSelectArray = (fieldProperties = {}) => {

    if (Array.isArray(fieldProperties.picklistValues)) {

        return fieldProperties.picklistValues.map(item => {

            return {
                value: item.value,
                label: item.label
            };
        });
    }

    return [];
};
