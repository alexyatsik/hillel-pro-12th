'use strict';

function createHeader(parent) {
    const header = createAndAppend(parent, 'div');
    header.classList.add('main-content__header', 'main-content__row');

    createAndAppend(header, 'div', 'ID').classList.add('main-content__item');
    createAndAppend(header, 'div', 'User name').classList.add('main-content__item');
    createAndAppend(header, 'div', 'Actions').classList.add('main-content__item');
}

function createAndShowConfirmPanel(target) {
    const deleteBtn = target;
    deleteBtn.style.display = 'none';

    const root = createAndAppend(target.parentElement, 'div');
    root.dataset.type = 'crud-button';
    createInputButton(root, 'Cancel').dataset.deleteConfirm = 'cancel';
    createInputButton(root, 'Delete').dataset.deleteConfirm = 'delete';

    root.addEventListener('click', event => {
        const deleteConfirm = event.target.dataset.deleteConfirm;

        if (deleteConfirm === 'delete') {
            deleteUser(target.dataset.id);
        }

        deleteBtn.style.display = 'block';
        root.remove();
    });
}

function addContentRow(parent, id, name) {
    const row = createAndAppend(parent, 'div');
    row.classList.add('main-content__row');
    row.dataset.id = id;

    createAndAppend(row, 'div', id).classList.add('main-content__item');
    const nameItem = createAndAppend(row, 'div', name);
    nameItem.classList.add('main-content__item');
    nameItem.dataset.name = true;
    createActionsPanel(row, id).classList.add('main-content__item');
}


function handleInput(form) {
    const handledData = {
        id: {},
        name: {},
        group: {},
        age: {},
        mail: {},
        telephone: {},
        card: {},
    };

    handledData.id.value = form.id.value;
    handledData.name.value = checkValueThroughRegExp(form.name.value, 'name');
    handledData.name.ref = form.name;
    handledData.group.value = checkValueThroughRegExp(form.group.value, 'group');
    handledData.group.ref = form.group;
    handledData.age.value = checkValueThroughRegExp(form.age.value, 'age');
    handledData.age.ref = form.age;
    handledData.mail.value = checkValueThroughRegExp(form.mail.value, 'mail');
    handledData.mail.ref = form.mail;
    handledData.telephone.value = checkValueThroughRegExp(form.telephone.value, 'telephone');
    handledData.telephone.ref = form.telephone;
    handledData.card.value = checkValueThroughRegExp(form.card.value, 'card');
    handledData.card.ref = form.card;

    return handledData;
}

function checkValueThroughRegExp(value, handler) {
    const regExpHandlers = {
        name: /^[A-Z][a-z]{1,30} [A-Z][a-z]{1,30}$/,
        group: /^(Admin|Moderator|User)$/,
        age: /^(1[8-9]|[2-9][0-9]|1[0-4][0-9])$/,
        mail: /^\w+[\w\.\+-]{1,253}\w+@\w+[\w\.-]{1,254}\w+\.[a-z]{2,3}$/i,
        telephone: /^\+38\(0[1-9][0-9]\)[0-9]{3}-[0-9]{2}-[0-9]{2}$/,
        card: /^((([0-9]{4}-){3}[0-9]{4})|(([0-9]{4} ){3}[0-9]{4}))$/
    };

    const result = value.match(regExpHandlers[handler]);

    if(result) {
        return result[0];
    } 
    
    return null;
}

function checkAndMarkFields(data) {
    let isInputCorrect = true;

    for (let key in data) {
        if (!data[key].value) {
            data[key].ref.classList.add('input-error');

            if (!data[key].ref.nextElementSibling) {
                insertErrorMsg(data[key].ref);
            }

            isInputCorrect = false;
        } else {
            if (data[key].ref) {
                data[key].ref.classList.remove('input-error');

                if (data[key].ref.nextElementSibling) {
                    data[key].ref.nextElementSibling.remove();
                }
            }
        }
    }

    return isInputCorrect;
}

function insertErrorMsg(parent) {
    const errorMsg = document.createElement('span');
    errorMsg.innerHTML = ' Incorrect input ';
    errorMsg.classList.add('input-error-msg');
    insertAfter(errorMsg, parent);
}


function deleteUser(id) {
    deleteUserFromDb(id);
    deleteUserFromContent(id);
}

function deleteUserFromDb(id) {
    const tempDb = getLocalStorageData();

    for (let i = 0; i < tempDb.length; i++) {
        if (tempDb[i].id === id) {
            tempDb.splice(i, 1);
            setLocalStorageData(tempDb);
        }
    }
}

function deleteUserFromContent(id) {
    const targetRow = document.querySelector(`.main-content__row[data-id="${id}"]`);

    if (targetRow) {
        targetRow.remove();
    }
}


function applyData(data) {
    addUserToDb(data); 
    addUserToContent(data.id.value); 
}

function addUserToDb(userData) {
    const tempDb = getLocalStorageData();

    const newUser = {
        id: userData.id.value,
        name: userData.name.value,
        group: userData.group.value,
        age: userData.age.value,
        mail: userData.mail.value,
        telephone: userData.telephone.value,
        card: userData.card.value
    }

    for (let i = 0; i < tempDb.length; i++) {
        if (tempDb[i].id === newUser.id) {
            tempDb[i] = newUser;
            setLocalStorageData(tempDb);

            return;
        }
    }

    tempDb.push(newUser);
    setLocalStorageData(tempDb);
}

function addUserToContent(id) {
    const tempDb = getLocalStorageData();
    const existUser = document.querySelector(`.main-content__row[data-id="${id}"]`);

    for (let i = tempDb.length - 1; i >= 0; i--) {
        if (tempDb[i].id === id) {
            // if user exists - update his content and return
            if (existUser) {
                existUser.querySelector('.main-content__item[data-name=true]').innerHTML = tempDb[i].name;
                
                return;
            }

            // add new user to the content
            const parent = document.getElementById('main-content');
            addContentRow(parent, tempDb[i].id, tempDb[i].name);
        }
    }
}




                