var express = require('express');
var router = express.Router();
var firebase = require("../app/firebase");
var shortId = require('shortid');
var _ = require('underscore');
var smtp = require("../app/smtp");

var users = {};

function save() {
    firebase.set({'users': users});
}

firebase.child('users').on('value', function(snapshot) {
    if(snapshot.val()) {
        users = snapshot.val();
        console.log('users loaded');
    }
});

var exists = function(email) {
    for(var id in users) {
        if(email == users[id].email) {
            return true;
        }
    }
    return false;
};

var sendVerificationCode = function(user) {
    var mailOptions = {
        from: "Avatar Voting <braveostrich@gmail.com>",
        to: user.email,
        subject: "Your verification code",
        text: user.id,
        html: user.id
    };

    smtp.sendMail(mailOptions, function (error, response) {
        if (error) {
            console.log('notification error: ' + error);
        } else {
            console.log("Message sent: " + response.message);
        }
    });
};

router.get('/', function(req, res) {
    res.send(_.values(users));
});

router.post('/', function(req, res) {
    var email = req.body.email;
    if(exists(email)) {
        res.status(409).end();
    } else {
        var id = shortId.generate();
        users[id] = {
            id: id,
            email: email,
            created: new Date()
        };
        save();
        sendVerificationCode(users[id]);

        res.status(201).send(req.path);
    }
});

module.exports = router;
