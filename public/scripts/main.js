let completeButtons = document.getElementsByClassName('complete-button');
let approveButtons = document.getElementsByClassName('approve-button');
let declineButtons = document.getElementsByClassName('decline-button');

let completeUrl = '/api/list/complete?';
let approveUrl = '/api/list/approve?';
let declineUrl = '/api/list/decline?';

for (let i = 0; i < completeButtons.length; i++) {
    completeButtons[i].addEventListener('click', () => completeItem(completeButtons[i].getAttribute('item-id')));
}

for (let i = 0; i < approveButtons.length; i++) {
    approveButtons[i].addEventListener('click', () => approveItem(approveButtons[i].getAttribute('item-id')));
}

for (let i = 0; i < declineButtons.length; i++) {
    declineButtons[i].addEventListener('click', () => declineItem(declineButtons[i].getAttribute('item-id')));
}

function completeItem(id) {
    let xhr = new XMLHttpRequest();
    let idParam = 'id=' + id;
    xhr.open('GET', completeUrl + idParam, true);
    xhr.send();

    xhr.onreadystatechange = function () {
        if (xhr.readyState != 4) return;

        location.reload(true);
    }
}

function approveItem(id) {
    let xhr = new XMLHttpRequest();
    let idParam = 'id=' + id;
    xhr.open('GET', approveUrl + idParam, true);
    xhr.send();

    xhr.onreadystatechange = function () {
        if (xhr.readyState != 4) return;

        location.reload(true);
    }
}

function declineItem(id) {
    let xhr = new XMLHttpRequest();
    let idParam = 'id=' + id;
    xhr.open('GET', declineUrl + idParam, true);
    xhr.send();

    xhr.onreadystatechange = function () {
        if (xhr.readyState != 4) return;

        location.reload(true);
    }
}
