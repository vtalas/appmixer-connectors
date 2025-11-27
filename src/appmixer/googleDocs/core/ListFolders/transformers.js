'use strict';

module.exports = {

    foldersToSelectArray(folders) {

        return folders.map(folder => ({
            label: folder.name,
            value: folder.id
        }));
    }
};
