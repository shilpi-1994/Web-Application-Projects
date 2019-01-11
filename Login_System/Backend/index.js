const express = require('express');
const app = express();
const port = 3002;
var msg = require('./messbox.js');
var bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(function (req, res, next) {
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:8080');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});

app.post('/login', (req, res) => {
    console.log("login")
    msg.loginUser(req.body, function (resp) {
        try {
            var jsonString = JSON.stringify(resp);
            res.json(jsonString);
        } catch (err) {
            console.log(err);
        }
    });
});

app.post('/register', (req, res) => {
    msg.registerUser(req.body, function (resp) {
        try {
            var jsonString = JSON.stringify(resp);
            res.json(jsonString);
        } catch (err) {
            console.log(err);
        }
    });
});

app.delete('/removeUser', (req, res) => {
    msg.deleteUser(req.body, function (resp) {
        try {
            var jsonString = JSON.stringify(resp);
            res.json(jsonString);
        } catch (err) {
            console.log(err);
        }
    });
});

app.get('/messages', (req, res) => {
    msg.getMessages(req.query, function (resp) {
        try {
            var jsonString = JSON.stringify(resp);
            res.json(jsonString);
        } catch (err) {
            console.log(err);
        }
    });
});
app.post('/messages/update', (req, res) => {
    msg.updateMessages(req.body, function (resp) {
        try {
            var jsonString = JSON.stringify(resp);
            res.json(jsonString);
        } catch (err) {
            console.log(err);
        }
    });
});

app.post('/messages/update/display', (req, res) => {
    msg.displayProfile(req.body, function (resp) {
        try {
            var jsonString = JSON.stringify(resp);
            res.json(jsonString);
        } catch (err) {
            console.log(err);
        }
    });
});

app.post('/messages/update/delete', (req, res) => {
    msg.deleteMessage(req.body, function (resp) {
        try {
            var jsonString = JSON.stringify(resp);
            res.json(jsonString);
        } catch (err) {
            console.log(err);
        }
    });
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));