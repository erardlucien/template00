'use strict';

let container = document.querySelector('.container');
let coworkerInfos = document.querySelector('.coworker-infos');
let coworkerinfosBody = document.querySelector('.coworker-infos-body');
let coworkerData = document.querySelector('#coworker-data');
let coworkerDataCells = coworkerData.content.querySelectorAll('td');
let addBtn = document.querySelector('.add-btn');
let workerName = document.querySelector('.worker-name');
let workShift = document.querySelector('.work-shift');
let hours = document.querySelector('.hours');
let workerToDelete = document.querySelector('.worker-to-delete');
let delBtn = document.querySelector('.del-btn');
let possibleWorkers = document.querySelector('.possible-workers');
let searchCoworker = document.querySelector('.search-coworker');
let searchingWorker = document.querySelector('.searching-worker');
let resetBtn = document.querySelector('.reset-btn');
let possibleWorkerName = document.querySelector('#possible-worker-name');
let messageElement = document.createElement('p');
messageElement.classList.add('message');
let timeout;
let timeout2;
const WORKSHIFTVALUES = ['Early', 'Late', 'Night'];
const MINHOURS = parseInt(hours.min);
const MAXHOURS = parseInt(hours.max);
const MAXNAMELENGTH = 11;

let dataSamples = [
    ['Mark', 'Early', 23],
    ['Eric', 'Early', 40],
    ['Emily', 'Night', 15],
    ['Suzane', 'Late', 25],
];

function saveValue(name, value) {
    if( typeof(Storage) !== 'undefined' ) {
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
    if (coworkerinfosBody.hasChildNodes()) {
        coworkerinfosBody.insertBefore(clone, coworkerinfosBody.firstChild);
    } else {
        coworkerinfosBody.appendChild(clone);
    }
}

function message(text) {
    let messageList = text.split('! ');

    while (messageElement.hasChildNodes()) {
        messageElement.removeChild(messageElement.firstChild);
        clearTimeout(timeout2);
    }

    for(let element of messageList) {
        let messageText = document.createTextNode(element);
        messageElement.appendChild(messageText);
        let newLine = document.createElement('br');
        messageElement.appendChild(newLine);
    }
    container.appendChild(messageElement);

    timeout2 = setTimeout(() => {
        container.removeChild(messageElement);
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
    for (let element of coworkerinfosBody.children) {
        let toCompare2 = element.children[0].textContent.toUpperCase();
        if (toCompare1.localeCompare(toCompare2) === 0) {
            return true;
        }
    }
    return false;
}

function returnWorker(name) {
    for (let element of coworkerinfosBody.children) {
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

// dataSamples.forEach(getData);

if( typeof(Storage) !== 'undefined') {
    let numberOfKeys = window.localStorage.length;
    for(let i = numberOfKeys - 1; i >= 0; --i) {
        let keyElement = window.localStorage.key(i);
        let data = window.localStorage.getItem(keyElement);
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
        message('Every inputs must be set!');
        return;
    }

    if (workerNameText.indexOf(' ') >= 0 ||
        workShiftText.indexOf(' ') >= 0) {
        message('Space is not allowed!');
        return;
    }

    if (isNaN(hoursNumber)) {
        message('Only Number is allowed for hours!');
        return;
    }

    if (workerNameText.length >= MAXNAMELENGTH + 1) {
        message('The length of name must be smaller than ' + (MAXNAMELENGTH + 1) + '!');
        return;
    }

    if (isAlreadyAWorker(workerNameText)) {
        let name = workerNameText.slice(0, 1).toUpperCase().concat(workerNameText.slice(1));
        message(name + ' is already a worker!');
        return;
    }

    if (!isworkShiftValid(workShiftText)) {
        message('The Shift must be Early, Late or Night!');
        return;
    }

    if (hoursNumber < MINHOURS || hoursNumber >= MAXHOURS + 1) {
        message('Only time between ' + MINHOURS + ' and ' + MAXHOURS + ' is allowed!');
        return;
    }

    saveValue( workerNameText, (workerNameText + ' ' + workShiftText + ' ' + hoursNumber) );
    getData([workerNameText, workShiftText, hoursNumber]);
    message(workerNameText + ' was added! Scrolldown to see the in the list!');
});

delBtn.addEventListener('click', () => {
    let toDelete = workerToDelete.value;

    if (toDelete.length < 1) {
        message('You must write a name!');
        return;
    }

    if (toDelete.indexOf(' ') >= 0) {
        message('Space is not allowed!');
        return;
    }

    if (!isAlreadyAWorker(toDelete)) {
        message(toDelete + ' is not part of the list!');
    } else {
        workerToDelete.value = '';
        window.localStorage.removeItem(toDelete);
        coworkerinfosBody.removeChild(returnWorker(toDelete));
        deletePossibleWorkers();
        message(toDelete + ' was deleted!');
    }
}
);

workerToDelete.addEventListener('keyup', () => {
    if (workerToDelete.value.length > 0) {
        window.scrollBy(
            {
                behavior: 'instant',
                top: workerToDelete.getBoundingClientRect().top - 60,
            }
        );
    }
});

searchingWorker.addEventListener('keyup', () => {
    if (searchingWorker.value.length > 0) {
        window.scrollBy(
            {
                behavior: 'instant',
                top: searchingWorker.getBoundingClientRect().top,
            }
        );
    }
});

function showPossibleWorkers() {
    let coworkers = coworkerinfosBody.children;
    let possibleWorkersToDelete = possibleWorkers.children;

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

let storedData;

workerToDelete.addEventListener('keyup', showPossibleWorkers);
searchingWorker.addEventListener('keyup', () => {
    if( storedData === undefined || storedData === null ) {
        storedData = coworkerinfosBody.cloneNode(true);
    }

    messageElement.style.bottom = '10%';

    while(coworkerinfosBody.hasChildNodes()) {
        coworkerinfosBody.removeChild(coworkerinfosBody.firstChild);
    }

    if( searchingWorker.value.length >= 1 ) {
        message('Scroll down to see the result!');
    }

    for(let element of storedData.children) {
        let workerName = element.children[0].textContent;
        if ( hasTheSameCharacters(workerName, searchingWorker.value) &&
        workerName.localeCompare(searchingWorker.value) >= 0 && 
        !isArealdyInside(workerName, coworkerinfosBody)) {
            let copyElement = element.cloneNode(true);
            coworkerinfosBody.appendChild(copyElement);
        }
    }

    if( !coworkerinfosBody.hasChildNodes() && searchingWorker.value.length >= 1) {
        message('No Worker found with that Name!');
    }

    if( searchingWorker.value === '' ) {
        while(coworkerinfosBody.hasChildNodes()) {
            coworkerinfosBody.removeChild(coworkerinfosBody.firstChild);
        }
    
        for(let element of storedData.children) {
            let copyElement = element.cloneNode(true);
            coworkerinfosBody.appendChild(copyElement);
        }

        storedData = null;
    }

});

resetBtn.addEventListener('click', () => {
    if( ( storedData !== undefined || storedData !== null ) && storedData.hasChildNodes() ) {
        while(coworkerinfosBody.hasChildNodes()) {
            coworkerinfosBody.removeChild(coworkerinfosBody.firstChild);
        }
    
        for(let element of storedData.children) {
            let copyElement = element.cloneNode(true);
            coworkerinfosBody.appendChild(copyElement);
        }

        storedData = null;
    }
});
