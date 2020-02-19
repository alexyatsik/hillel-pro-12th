'use strict';

window.addEventListener('DOMContentLoaded', () => {
    if (!hasLocalStorageData()) {
        setLocalStorageData(dbAccounts);
    }

    const crudRootElement = document.getElementById('crudApp');
    createContent(crudRootElement);
});