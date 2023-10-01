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
let possibleWorkerName = document.querySelector('#possible-worker-name');
let timeout;
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

function getData(data) {
    coworkerDataCells[0].textContent = data[0];
    coworkerDataCells[1].textContent = data[1];
    coworkerDataCells[2].textContent = data[2];

    let clone = document.importNode(coworkerData.content, true);
    if(coworkerinfosBody.hasChildNodes()) {
        coworkerinfosBody.insertBefore(clone, coworkerinfosBody.firstChild);
    } else {
        coworkerinfosBody.appendChild(clone);
    }
}

function message(text) {
    let messageElement = document.createElement('p');
        let messageText = document.createTextNode(text);
        messageElement.appendChild(messageText);
        container.insertBefore(messageElement, coworkerInfos);

        setTimeout( () => {
            container.removeChild(messageElement);
        }, 1500 );
}

function isworkShiftValid(workShiftText) {
    for(let element of WORKSHIFTVALUES) {
        if(element === workShiftText) {
            return true;
        }
    }
    return false;
}

function isAlreadyAWorker(name) {
    for(let element of coworkerinfosBody.children) {
        if(element.children[0].textContent === name) {
            return true;
        }
    }
    return false;
}

function returnWorker(name) {
    for(let element of coworkerinfosBody.children) {
        if(element.children[0].textContent === name) {
            return element;
        }
    }
    return null;
}

function hasTheSameCharacters(toCompare1, toCompare2) {

    if(toCompare2.length === 0) {
        return false;
    }

    for(let i = 0; i < toCompare2.length; ++i) {
        if( toCompare1.charAt(i) !== toCompare2.charAt(i) ) {
            return false;
        }
    }

    return true;
}

function isArealdyInside(text) {
    let possibleWorkersToDelete = possibleWorkers.children;
    for(let element of possibleWorkersToDelete) {
        if(text.localeCompare(element.textContent) === 0) {
            return true;
        }
    }

    return false;
}

dataSamples.forEach(getData);

addBtn.addEventListener('click', () => {
    let workerNameText = workerName.value;
    let workShiftText = workShift.value;
    let hoursNumber = parseInt(hours.value);

    if( workerNameText.length < 1 ||
        workShiftText.length < 1 ||
        hoursNumber.length < 1 ) {
        message('Every inputs must be set!');
        return;
    }

    if( workerNameText.indexOf(' ') >= 0 ||
    workShiftText.indexOf(' ') >= 0 ) {
        message('Space is not allowed!');
        return;
    }

    if( isNaN(hoursNumber) ) {
        message('Only Number is allowed for hours!');
        return;
    }

    if( workerNameText.length >= MAXNAMELENGTH + 1) {
        message('The length of name must be smaller than ' + MAXNAMELENGTH + '!');
        return;
    }

    if(isAlreadyAWorker(workerNameText)) {
        message( workerNameText + ' is already a worker!');
        return;
    }

    if(!isworkShiftValid(workShiftText)) {
        message('The Shift must be Early, Late or Night!');
        return;
    }

    if(hoursNumber < MINHOURS || hoursNumber >= MAXHOURS + 1) {
        message('Only time between ' + MINHOURS + ' and ' + MAXHOURS + ' is allowed!');
        return;
    }

    getData([workerNameText, workShiftText, hoursNumber]);
    message(workerNameText + ' was added!');
});

delBtn.addEventListener('click', () => {
    let toDelete = workerToDelete.value;

    if( toDelete.length < 1 ) {
        message('You muss write a name!');
        return;
    }

    if( toDelete.indexOf(' ') >= 0 ) {
        message('Space is not allowed!');
        return;
    }

    if(!isAlreadyAWorker(toDelete)) {
        message(toDelete + ' is not part of the list!');
    } else {
        workerToDelete.value = '';
        coworkerinfosBody.removeChild(returnWorker(toDelete));
        message(toDelete + ' was deleted!');
    }
}
);

(
    function showPossibleWorkers() {
        let coworkers = coworkerinfosBody.children;

        while( possibleWorkers.children.length >= 1) {
            possibleWorkers.removeChild(possibleWorkers.firstChild);
        }

        if(delBtn.clicked) {
            clearTimeout(timeout);
        }

        for(let element of coworkers) {
            let workerName = element.children[0].textContent;

            if( hasTheSameCharacters(workerName, workerToDelete.value) &&
            workerName.localeCompare(workerToDelete.value) >= 0 && 
            !isArealdyInside(workerName) ) {
                let workerInList = possibleWorkerName.content.querySelector('li');
                workerInList.appendChild(document.createTextNode(workerName));
                let clone = document.importNode(possibleWorkerName.content, true);
                possibleWorkers.appendChild(clone);
                workerInList.removeChild(workerInList.firstChild);
                
            }
        }

        let possibleWorkersToDelete = possibleWorkers.children;

        for(let element of possibleWorkersToDelete) {
            element.addEventListener('click', () => {
                let workerName = element.textContent;
                workerToDelete.value = workerName;
                clearTimeout(timeout);
                timeout = setTimeout(showPossibleWorkers, 1000);
            });
        }

        timeout = setTimeout(showPossibleWorkers, 1000);
    }
)();

