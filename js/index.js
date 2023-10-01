'use strict';

let container = document.querySelector('.container');
let coworkerInfos = document.querySelector('.coworker-infos');
let coworkerinfosBody = document.querySelector('.coworker-infos-body');
let coworkerData = document.querySelector('#coworker-data');
let coworkerDataCells = coworkerData.content.querySelectorAll('td');
let addBtn = document.querySelector('.add-btn');
let workerName = document.querySelector('.worker-name');
let worktime = document.querySelector('.worktime');
let hours = document.querySelector('.hours');
let workerToDelete = document.querySelector('.worker-to-delete');
let delBtn = document.querySelector('.del-btn');
let possibleWorkers = document.querySelector('.possible-workers');
let possibleWorkerName = document.querySelector('#possible-worker-name');
let timeout;
const WORKTIMEVALUES = ['Früh', 'Spät', 'Nacht'];
const MINHOURS = parseInt(hours.min);
const MAXHOURS = parseInt(hours.max);
const MAXNAMELENGTH = 7;

let dataSamples = [
    ['Mark', 'Früh', 23],
    ['Eric', 'Früh', 40],
    ['Emily', 'Nacht', 15],
    ['Suzane', 'Spät', 25],
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

function isWorktimeValid(worktime) {
    for(let element of WORKTIMEVALUES) {
        if(element === worktime) {
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
    let workTimeText = worktime.value;
    let hoursNumber = parseInt(hours.value);

    if( workerNameText.length < 1 ||
        workTimeText.length < 1 ||
        hoursNumber.length < 1 ) {
        message('Alles muss gesetzt werden!');
        return;
    }

    if( workerNameText.indexOf(' ') >= 0 ||
    workTimeText.indexOf(' ') >= 0 ) {
        message('Leerzeichen sind nicht erlaubt!');
        return;
    }

    if( isNaN(hoursNumber) ) {
        message('Nur Zahlen sind erlaubt!');
        return;
    }

    if( workerNameText.length >= MAXNAMELENGTH + 1) {
        message('Der Name darf nicht länger als ' + MAXNAMELENGTH + ' sein!');
        return;
    }

    if(isAlreadyAWorker(workerNameText)) {
        message('Ist schon ein Mitarbeiter!');
        return;
    }

    if(!isWorktimeValid(workTimeText)) {
        message('Der Sicht muss Früh, Spät oder Nacht sein!');
        return;
    }

    if(hoursNumber < MINHOURS || hoursNumber >= MAXHOURS + 1) {
        message('Die Stunden müssen zwischen 10 und 40 Stunden sein!');
        return;
    }

    getData([workerNameText, workTimeText, hoursNumber]);
    message(workerNameText + ' wurde hinzugefügt!');
});

delBtn.addEventListener('click', () => {
    let toDelete = workerToDelete.value;

    if( toDelete.length < 1 ) {
        message('Eine Eingabe muss hinzugefügt werden!');
        return;
    }

    if( toDelete.indexOf(' ') >= 0 ) {
        message('Leerzeichen sind nicht erlaubt!');
        return;
    }

    if(!isAlreadyAWorker(toDelete)) {
        message(toDelete + ' gehört nicht zur Liste!');
    } else {
        workerToDelete.value = '';
        coworkerinfosBody.removeChild(returnWorker(toDelete));
        message(toDelete + ' ist gelöscht!');
    }
}
);

(
    function showPossibleWorkers() {
        let coworkers = coworkerinfosBody.children;

        setTimeout(
            () => {
                while( possibleWorkers.children.length >= 1) {
                    possibleWorkers.removeChild(possibleWorkers.firstChild);
                }
            }
            , 2000);

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
                timeout = setTimeout(showPossibleWorkers, 2500);
            });
        }

        timeout = setTimeout(showPossibleWorkers, 2500);
    }
)();

