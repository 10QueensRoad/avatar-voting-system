var express = require('express');
var router = express.Router();
var firebase = require('../app/firebase');
var shortId = require('shortid');
var _ = require('underscore');
var smtp = require('../app/smtp');

var users = {};

function save() {
    firebase.child('users').set(users);
}

firebase.child('users').on('value', function (snapshot) {
    if (snapshot.val()) {
        users = snapshot.val();
        console.log('users loaded');
    }
});

router.get('/', function (req, res) {
    res.send(_.values(users).map(function (user) {
        return {email: user.email, verified: user.verified};
    }));
});

router.get('/home', function (req, res) {
    var token = req.query.token;
    if (users[token]) {
        users[token].verified = true;
        save();
        req.session.user = users[token];
        res.send('verified');
    } else {
        res.send('invalid token');
    }
});

router.post('/', function (req, res) {
    var email = req.body.email;
    if (exists(email)) {
        res.status(409).end();
    } else {
        var id = shortId.generate();
        users[id] = {
            id: id,
            email: email,
            created: new Date()
        };
        save();

        var url = req.protocol + '://' + req.headers.host + '/users/home?token=' + id;
        sendMail(users[id], url);

        res.status(201).end();
    }
});

var exists = function (email) {
    return _.find(_.values(users), function (user) {
        return user.email == email
    });
};

var sendMail = function (user, url) {
    var mailOptions = {
        from: "Avatar Voting <robot1.yanhui@gmail.com>",
        to: user.email,
        subject: "Your login Url",
        text: url,
        html: '<a href="' + url + '">' + url + '</a>'
    };

    smtp.sendMail(mailOptions, function (error) {
        if (error) {
            console.log('notification error: ' + error);
        } else {
            console.log("Message sent to " + user.email);
        }
    });
};

module.exports = {router: router, validate: function (token) {
    return !!(users[token]);
}};