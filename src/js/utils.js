'use strict';

function createAndAppend(parent, tagName, content) {
    const tag = document.createElement(`${tagName}`);

    if (content) {
        tag.innerHTML = content;
    }

    parent.appendChild(tag);

    return parent.lastElementChild;
}

function createInputText(parent, name, placeholder) {
    const textInput = createAndAppend(parent, 'input');
    textInput.setAttribute('name', name);

    if (placeholder) {
        textInput.setAttribute('placeholder', placeholder);
    }
    
    textInput.classList.add('input-text');

    return parent.lastElementChild;
}

function createInputButton(parent, value) {
    const button = createAndAppend(parent, 'input');
    button.setAttribute('type', 'button');
    button.setAttribute('value', value);
    button.classList.add('input-button');
    
    return parent.lastElementChild;
}

function deleteElementById(elementId) {
    const element = document.getElementById(elementId);

    if (element) {
        element.remove();

        return true;
    }

    return false;
}

function insertAfter(node, target) {
    target.parentNode.insertBefore(node, target.nextSibling);

    return node;
}


function hasLocalStorageData() {
    return localStorage.getItem('crudAppDb');
}

function getLocalStorageData() {
    return JSON.parse(localStorage.getItem('crudAppDb'));
}

function setLocalStorageData(data) {
    localStorage.setItem('crudAppDb', JSON.stringify(data));
}


function getItemById(id, collection) {
    for (let i = 0; i < collection.length; i++) {
        if (!collection[i].id) {
            continue;
        }

        if (collection[i].id === id) {
            return collection[i];
        }
    }

    return null;
}

function createIdForDb(db) {
    db[0].counter++;

    return db[0].counter;
}