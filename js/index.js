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
    let warningElement = document.createElement('p');
        let warningText = document.createTextNode(text);
        warningElement.appendChild(warningText);
        container.insertBefore(warningElement, coworkerInfos);

        setTimeout( () => {
            container.removeChild(warningElement);
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
        let text = '';
        let coworkers = coworkerinfosBody.children;

        if(delBtn.clicked) {
            clearTimeout(timeout);
        }

        for(let element of coworkers) {
            let workerName = element.children[0].textContent;
            if( workerName.charAt(0) === workerToDelete.value.charAt(0) ) {
                text += workerName + ' | ';
            }
        }

        message(text);

        timeout = setTimeout(showPossibleWorkers, 2000);
    }
)();

