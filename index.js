const express = require("express");
const PORT = process.env.PORT || 5000;
const path = require("path");
const request = require("request");
const tmi = require('tmi.js');


const options = require('./botconfig.json');

let app = express();

app.set('view engine', 'pug');
app.set('views', './views');

app.use(express.static("public"));

app.get("/", function (req, res) {
    res.render('index', {
        data: listArray
    });
});

app.get("/api/list/complete", function (req, res) {
    let itemId = req.query.id;
    let id = findItemById(listArray, itemId);
    if (~id) {
        listArray.splice(id, 1);
        res.status(200).end();
    } else {
        res.status(404).end();
    }
});

app.get("/api/list/approve", function (req, res) {
    let itemId = req.query.id;
    let id = findItemById(listArray, itemId);
    if (~id) {
        listArray[id].approved = true;
        client.whisper(listArray[id].userName, "Скоро сыграют произведение которое вы заказали");
        res.status(200).end();
    } else {
        res.status(404).end();
    }
});

app.get("/api/list/decline", function (req, res) {
    let itemId = req.query.id;
    let id = findItemById(listArray, itemId);
    if (~id) {
        client.whisper(listArray[id].userName, "К сожалению ваше произведение не будут играть, закажите другое");
        listArray.splice(id, 1);
        res.status(200).end();
    } else {
        res.status(404).end();
    }
});

let server = app.listen(PORT, () => console.log("Listening on ${ PORT }"));

// --------------------- Раздел бота ------------------------------------------
class Commands {
    constructor() {}

    //Добавление заявки в лист
    _listAdd(msg, username) {
        let listItem = {};
        listItem.id = idNumber++;
        listItem.approved = false;
        listItem.userName = username;
        msg.shift();
        listItem.message = msg.join(' ');
        listArray.push(listItem);

        client.whisper(username, "Ваша заявка \"" +
            listItem.message +
            "\" отправлена, ждите подтверждения");
    }

    //Показ пользователю списка заявок
    _listShow(username) {
        if (listArray.length === 0) {
            client.whisper(username, "Сейчас список пуст, вы можете пополнить его при помощи !список Название произведения");
        } else {
            let listApproved = [];
            for (let i = 0; i < listArray.length; i++) {
                if (listArray[i].approved) {
                    listApproved.push(listArray[i].message);
                }
            }

            if (listApproved.length === 0) {
                client.whisper(username, "Сейчас нет одобренных заявок, попробуйте добавить свою если еще этого не сделали !список Название произведения");
                return;
            }

            client.whisper(username, "Сейчас в очереди: " + listApproved.join(','));
        }
    }

    //Обработка команды !список
    list(msg, username) {
        if (msg.length === 1) {
            this._listShow(username);
        } else if (!~findItemByName(listArray, username)) {
            this._listAdd(msg, username);
        } else {
            client.whisper(username, "Ваша заявка уже в списке подождите пока его одобрят или отклонят");
        }
    }
}

let client = new tmi.client(options);
client.connect();

let commands = new Commands();
let listArray = [];
let idNumber = 0;


client.on("connected", function (adress, port) {
    client.say(options.channels[0], "Добрый день, готов принимать ваши заказы (!список)");
});

client.on("chat", function (channel, userstate, message, self) {
    if (self) return;

    let splitMSG = message.replace(/(^\s*)|(\s*)$/g, '').split(' ');

    switch (splitMSG[0].toLowerCase()) {
        case '!список':
            commands.list(splitMSG, userstate.username);
            break;
        default:
            return;
            break;
    }
});

client.on("whisper", function (from, userstate, message, self) {
    if (self) return;

    let splitMSG = message.replace(/(^\s*)|(\s*)$/g, '').split(' ');

    switch (splitMSG[0].toLowerCase()) {
        case '!список':
            commands.list(splitMSG, userstate.username);
            break;
        default:
            return;
            break;
    }
});

function findItemByName(arr, name) {
    for (let i = 0; i < arr.length; i++) {
        if (arr[i].userName == name) return i;
    }

    return -1;
}

function findItemById(arr, id) {
    for (let i = 0; i < arr.length; i++) {
        if (arr[i].id == id) return i;
    }

    return -1;
}
