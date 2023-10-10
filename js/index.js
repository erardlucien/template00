'use strict';

let container = document.querySelector('.container');
let coworkerInfos = document.querySelector('.coworker-infos');
let coworkerInfosBody = document.querySelector('.coworker-infos-body');
let coworkerData = document.querySelector('#coworker-data');
let coworkerDataCells = coworkerData.content.querySelectorAll('td');
let addBtn = document.querySelector('.add-btn');
let workerName = document.querySelector('.worker-name');
let workShift = document.querySelector('.work-shift');
let hours = document.querySelector('.hours');
let workerToDelete = document.querySelector('.worker-to-delete');
let delBtn = document.querySelector('.del-btn');
let delAllBtn = document.querySelector('.del-all-btn');
let possibleWorkers = document.querySelector('.possible-workers');
let searchCoworker = document.querySelector('.search-coworker');
let searchingWorker = document.querySelector('.searching-worker');
let resetBtn = document.querySelector('.reset-btn');
let possibleWorkerName = document.querySelector('#possible-worker-name');
let messageElement = document.createElement('p');
messageElement.classList.add('message');
let timeout;
let timeout2;
let storedData;
const WORKSHIFTVALUES = ['Early', 'Late', 'Night'];
const MINHOURS = parseInt(hours.min);
const MAXHOURS = parseInt(hours.max);
const MAXNAMELENGTH = 11;
const FIRSTID = 1000;
let idCounter = 0;

let dataSamples = [
    ['Mark', 'Early', 23],
    ['Eric', 'Early', 40],
    ['Emily', 'Night', 15],
    ['Suzane', 'Late', 25],
];

function saveValue(name, value) {
    if (typeof (Storage) !== 'undefined') {
        window.localStorage.setItem(name, value);
    } else {
        alert('Your webbrowser doesn\'t support Web Storage');
    }
}

function clearStorage() {
    window.localStorage.clear();
}

function getData(data) {
    coworkerDataCells[0].textContent = data[0];
    coworkerDataCells[1].textContent = data[1];
    coworkerDataCells[2].textContent = data[2];

    let clone = document.importNode(coworkerData.content, true);
    if (coworkerInfosBody.hasChildNodes()) {
        let length = coworkerInfosBody.children.length;
        coworkerInfosBody.insertBefore(clone, coworkerInfosBody.firstChild);
    } else {
        coworkerInfosBody.appendChild(clone);
    }
}

function message(text, prevSibling) {
    let messageList = text.split('! ');
    let parent = prevSibling.parentNode;

    if (text.indexOf('!') === 0) {
        messageElement.style.backgroundColor = 'var(--clr-warning)';
    } else {
        messageElement.style.backgroundColor = 'var(--clr-ternary)';
    }

    while (messageElement.hasChildNodes()) {
        messageElement.removeChild(messageElement.firstChild);
        clearTimeout(timeout2);
    }

    for (let element of messageList) {
        let messageText = document.createTextNode(element);
        messageElement.appendChild(messageText);
        let newLine = document.createElement('br');
        messageElement.appendChild(newLine);
    }
    parent.insertBefore(messageElement, prevSibling);

    timeout2 = setTimeout(() => {
        parent.removeChild(messageElement);
    }, 2000);
}

function isworkShiftValid(workShiftText) {
    for (let element of WORKSHIFTVALUES) {
        if (element === workShiftText) {
            return true;
        }
    }
    return false;
}

function isAlreadyAWorker(name, list) {
    let toCompare1 = name.toUpperCase();
    for (let element of coworkerInfosBody.children) {
        let toCompare2 = element.children[0].textContent.toUpperCase();
        if (toCompare1.localeCompare(toCompare2) === 0) {
            return true;
        }
    }
    return false;
}

function returnWorker(name) {
    for (let element of coworkerInfosBody.children) {
        if (element.children[0].textContent === name) {
            return element;
        }
    }
    return null;
}

function hasTheSameCharacters(toCompare1, toCompare2) {

    if (toCompare2.length === 0) {
        return false;
    }

    for (let i = 0; i < toCompare2.length; ++i) {
        if (toCompare1.charAt(i) !== toCompare2.charAt(i)) {
            return false;
        }
    }

    return true;
}

function isArealdyInside(text, list) {
    let elements = list.children;
    let toCompare1 = text.toLowerCase();
    for (let element of elements) {
        let toCompare2 = element.textContent.toLowerCase();
        if (toCompare1.localeCompare(toCompare2) === 0) {
            return true;
        }
    }

    return false;
}

function deletePossibleWorkers() {
    while (possibleWorkers.hasChildNodes()) {
        possibleWorkers.removeChild(possibleWorkers.firstChild);
    }
}

function removeAllData() {
    while (coworkerInfosBody.hasChildNodes()) {
        coworkerInfosBody.removeChild(coworkerInfosBody.firstChild);
    }
}

// dataSamples.forEach(getData);

if (typeof (Storage) !== 'undefined') {
    let length = window.localStorage.length;
    for (let i = 0; i < length; ++i) {
        let data = localStorage.getItem((FIRSTID + idCounter++));
        let dataElements = data.split(' ');
        getData([dataElements[0], dataElements[1], dataElements[2]]);
    }
}

addBtn.addEventListener('click', () => {
    let workerNameText = workerName.value;

    workerNameText = workerNameText.slice(0, 1).toUpperCase().concat(workerNameText.slice(1).toLowerCase());

    let workShiftText = workShift.value;
    let hoursNumber = parseInt(hours.value);

    if (workerNameText.length < 1 ||
        workShiftText.length < 1 ||
        hoursNumber.length < 1) {
        message('!Every inputs must be set!', addBtn);
        return;
    }

    if (hasSpace(workerNameText) ||
        hasSpace(workShiftText)) {
        message('!Space is not allowed!', addBtn);
        return;
    }

    if (isNaN(hoursNumber)) {
        message('!Only Number is allowed for hours!', addBtn);
        return;
    }

    if (workerNameText.length >= MAXNAMELENGTH + 1) {
        message('!The length of name must be smaller than ' + (MAXNAMELENGTH + 1) + '!', addBtn);
        return;
    }

    if (isAlreadyAWorker(workerNameText)) {
        let name = workerNameText.slice(0, 1).toUpperCase().concat(workerNameText.slice(1));
        message(name + ' is already a worker!', addBtn);
        return;
    }

    if (!isworkShiftValid(workShiftText)) {
        message('The Shift must be Early, Late or Night!', addBtn);
        return;
    }

    if (hoursNumber < MINHOURS || hoursNumber >= MAXHOURS + 1) {
        message('!Only time between ' + MINHOURS + ' and ' + MAXHOURS + ' is allowed!', addBtn);
        return;
    }

    saveValue((FIRSTID + idCounter++), (workerNameText + ' ' + workShiftText + ' ' + hoursNumber));
    getData([workerNameText, workShiftText, hoursNumber]);
    message(workerNameText + ' was added! Scrolldown to see the in the list!', addBtn);
});

delBtn.addEventListener('click', () => {
    let toDelete = workerToDelete.value;

    if (toDelete.length < 1) {
        message('!You must write a name!', delBtn);
        return;
    }

    if (hasSpace(toDelete)) {
        message('!Space is not allowed!', delBtn);
        return;
    }

    if (!isAlreadyAWorker(toDelete) && !hasSpace(toDelete)) {
        message(toDelete + ' is not part of the list!', delBtn);
    } else {
        workerToDelete.value = '';
        window.localStorage.removeItem(toDelete);
        coworkerInfosBody.removeChild(returnWorker(toDelete));
        deletePossibleWorkers();
        message(toDelete + ' was deleted!', delBtn);

        if (typeof (Storage) !== 'undefined') {
            let length = coworkerInfosBody.children.length;
            idCounter = 0;
            clearStorage();

            for (let i = length - 1; i >= 0; --i) {
                let element = coworkerInfosBody.children[i];
                let data = element.children;
                localStorage.setItem((FIRSTID + idCounter++), (data[0].textContent + ' ' + data[1].textContent + ' ' + data[2].textContent));
            }
        }
    }
}
);

function showPossibleWorkersToDelete() {

    let coworkers = coworkerInfosBody.children;
    let possibleWorkersToDelete = possibleWorkers.children;

    if (hasSpace(workerToDelete.value)) {
        message('!Space is not allowed!', workerToDelete);
        return;
    }

    while (possibleWorkers.children.length >= 1) {
        possibleWorkers.removeChild(possibleWorkers.firstChild);
    }

    for (let element of coworkers) {
        let workerName = element.children[0].textContent;

        if (hasTheSameCharacters(workerName, workerToDelete.value) &&
            workerName.localeCompare(workerToDelete.value) >= 0 &&
            !isArealdyInside(workerName, possibleWorkers)) {
            let workerInList = possibleWorkerName.content.querySelector('.worker');
            workerInList.appendChild(document.createTextNode(workerName));
            let clone = document.importNode(possibleWorkerName.content, true);
            possibleWorkers.appendChild(clone);
            workerInList.removeChild(workerInList.firstChild);

        }
    }

    for (let element of possibleWorkersToDelete) {
        element.addEventListener('click', () => {
            let workerName = element.textContent;
            workerToDelete.value = workerName;
            deletePossibleWorkers();
        });
    }
}

function hasSpace(text) {
    if (text !== undefined && text !== null && typeof (text) === 'string') {
        return text.indexOf(' ') >= 0;
    }
    return false;
}

function showFindedWorkers() {
    if (storedData === undefined || storedData === null) {
        storedData = coworkerInfosBody.cloneNode(true);
    }

    if (hasSpace(searchingWorker.value)) {
        message('!Space is not allowed!', searchingWorker);
        return;
    }

    while (coworkerInfosBody.hasChildNodes()) {
        coworkerInfosBody.removeChild(coworkerInfosBody.firstChild);
    }

    for (let element of storedData.children) {
        let workerName = element.children[0].textContent;
        if (hasTheSameCharacters(workerName, searchingWorker.value) &&
            workerName.localeCompare(searchingWorker.value) >= 0 &&
            !isArealdyInside(workerName, coworkerInfosBody)) {
            let copyElement = element.cloneNode(true);
            coworkerInfosBody.appendChild(copyElement);
        }
    }

    if (!coworkerInfosBody.hasChildNodes()
        && searchingWorker.value.length >= 1
        && !hasSpace(searchingWorker.value)
    ) {
        message('No Worker found with that Name!', searchingWorker);
    } else if (coworkerInfosBody.hasChildNodes()
        && searchingWorker.value.length >= 1
        && !hasSpace(searchingWorker.value)) {
        message('Scrolldown to see the result!', searchingWorker);
    }

    if (searchingWorker.value === '') {
        while (coworkerInfosBody.hasChildNodes()) {
            coworkerInfosBody.removeChild(coworkerInfosBody.firstChild);
        }

        for (let element of storedData.children) {
            let copyElement = element.cloneNode(true);
            coworkerInfosBody.appendChild(copyElement);
        }

        storedData = null;
    }

}

workerToDelete.addEventListener('keyup', showPossibleWorkersToDelete);
searchingWorker.addEventListener('input', showFindedWorkers);

resetBtn.addEventListener('click', () => {
    if (storedData !== undefined && storedData !== null) {
        removeAllData();
        searchingWorker.value = '';

        for (let element of storedData.children) {
            let copyElement = element.cloneNode(true);
            coworkerInfosBody.appendChild(copyElement);
        }

        storedData = null;
    }
});

delAllBtn.addEventListener('click', () => {
    if (coworkerInfosBody.hasChildNodes()) {
        message('All Workers were removed!', delAllBtn);
        removeAllData();
        clearStorage();
        idCounter = 0;
    } else {
        message('There is no element in the list!', delAllBtn);
    }
});
