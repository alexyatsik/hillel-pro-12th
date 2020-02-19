'use strict';

function createContent(parent) {
    const root = createAndAppend(parent, 'div');
    root.setAttribute('id', 'main-content');

    root.addEventListener('click', event => {
        const current = event.target;

        if (current.dataset.type === 'crud-button' && current.dataset.action === 'delete') {
            deleteElementById('crudForm');
            createAndShowConfirmPanel(current);
        } else if (current.dataset.type === 'crud-button') { 
            createCRUDForm(parent, current.dataset.id, current.dataset.action);
        }
    });

    const addButton = createInputButton(root, 'Add');
    addButton.dataset.action = 'add';
    addButton.dataset.type = 'crud-button';

    createHeader(root);
    generateContent(root);
}

function generateContent(parent) {
    const db = getLocalStorageData();

    for (let i = 0; i < db.length; i++) {
        if (db[i].name === 'idCounter') {
            continue;
        }

        addContentRow(parent, db[i].id, db[i].name);
    }
}

function createActionsPanel(parent, id) {
    const root = createAndAppend(parent, 'div');

    createActionButton(root, 'View', id);
    createActionButton(root, 'Edit', id);
    createActionButton(root, 'Delete', id);

    return parent.lastElementChild;
}

function createActionButton(parent, action, id) {
    const button = createInputButton(parent, action);
    
    button.dataset.id = id;
    button.dataset.action = action.toLowerCase();
    button.dataset.type = 'crud-button';
}


function createCRUDForm(parent, itemId, action) {
    deleteElementById('crudForm');

    const root = createAndAppend(parent, 'form');
    root.setAttribute('id', 'crudForm');
    const basement = createFormBasement(root);

    const db = getLocalStorageData();
    const selectedItem = getItemById(itemId, db);

    fillCRUDForm(action, basement, root, selectedItem);

    root.addEventListener('click', event => {
        const target = event.target.dataset.action;

        if (target === 'apply') {
            const handledData = handleInput(root);

            if (checkAndMarkFields(handledData)) {
                applyData(handledData);
                deleteElementById('crudForm');
            }
        } 
        
        if (target === 'close') {
            deleteElementById('crudForm');
        }
    });
}

function createFormBasement(parent) {
    const basement = {};
    const marginRight = '5px';

    basement.id = createAndAppend(parent, 'div');
    createAndAppend(basement.id, 'span', '<strong>ID:</strong>').style.marginRight = marginRight;
    basement.name = createAndAppend(parent, 'div');
    createAndAppend(basement.name, 'span', '<strong>User name:</strong>').style.marginRight = marginRight;
    basement.group = createAndAppend(parent, 'div');
    createAndAppend(basement.group, 'span', '<strong>Group:</strong>').style.marginRight = marginRight;
    basement.age = createAndAppend(parent, 'div');
    createAndAppend(basement.age, 'span', '<strong>Age:</strong>').style.marginRight = marginRight;
    basement.mail = createAndAppend(parent, 'div');
    createAndAppend(basement.mail, 'span', '<strong>E-mail:</strong>').style.marginRight = marginRight;
    basement.telephone = createAndAppend(parent, 'div');
    createAndAppend(basement.telephone, 'span', '<strong>Telephone:</strong>').style.marginRight = marginRight;
    basement.card = createAndAppend(parent, 'div');
    createAndAppend(basement.card, 'span', '<strong>Card:</strong>').style.marginRight = marginRight;

    return basement;
}

function fillCRUDForm(action, basement, root, selectedItem) {
    switch (action) {
        case 'add':
            createEditOutput(basement);
            createInputButton(root, 'Add user').dataset.action = 'apply';   
            break;

        case 'view':
            createViewOutput(basement, selectedItem);
            break;

        case 'edit':
            createEditOutput(basement, selectedItem);
            createInputButton(root, 'Apply').dataset.action = 'apply';   
            break;
    }
    createInputButton(root, 'Close').dataset.action = 'close';
}

function createViewOutput(parent, item) {
    createAndAppend(parent.id, 'span', item.id);
    createAndAppend(parent.name, 'span', item.name);
    createAndAppend(parent.group, 'span', item.group);
    createAndAppend(parent.age, 'span', item.age);
    createAndAppend(parent.mail, 'span', item.mail);
    createAndAppend(parent.telephone, 'span', item.telephone);
    createAndAppend(parent.card, 'span', item.card);    
}

// Edit in the name means - editable
function createEditOutput(parent, item) {
    const itemId = createInputText(parent.id, 'id');
    itemId.disabled = true;

    if (item) {
        itemId.setAttribute('value',  `${item.id}`);

        fillEditOutput(parent, item);
    } else {
        const tempDb = getLocalStorageData();
        const id = createIdForDb(tempDb);
        itemId.setAttribute('value',  `${id}`);
        setLocalStorageData(tempDb);

        fillEditOutput(parent);
    }
}

function fillEditOutput(parent, item) {
    const output = {
        name: createInputText(parent.name, 'name', 'First and Last name'),
        group: createInputText(parent.group, 'group', 'Admin / Moderator / User'),
        age: createInputText(parent.age, 'age', '18-149'),
        mail: createInputText(parent.mail, 'mail', 'User e-mail'),
        telephone: createInputText(parent.telephone, 'telephone', '+38(123)456-78-90'),
        card: createInputText(parent.card, 'card', 'dash / space every 4 digits')
    }

    if (item) {
        output.name.setAttribute('value', item.name);
        output.group.setAttribute('value', item.group);
        output.age.setAttribute('value', item.age);
        output.mail.setAttribute('value', item.mail);
        output.telephone.setAttribute('value', item.telephone);
        output.card.setAttribute('value', item.card);
    }
}


