var express = require('express');
var router = express.Router();
var shortId = require('shortid');
var _ = require('underscore');
var firebase = require('../app/firebase');

var suggestions = {};

function save() {
    firebase.child('suggestions').set(suggestions);
}

firebase.child('suggestions').on('value', function(snapshot) {
   if(snapshot.val()) {
       suggestions = snapshot.val();
       console.log('suggestions loaded');
   }
});

var exists = function(name) {
    for(var id in suggestions) {
        if(name == suggestions[id].name) {
            return true;
        }
    }
    return false;
};

router.get('/', function(req, res) {
    res.send(_.values(suggestions));
});

router.post('/', function(req, res) {
    var suggestion = req.body.suggestion;
    if(exists(suggestion)) {
        res.status(409).end();
    } else {
        var id = shortId.generate();
        suggestions[id] = {
            id: id,
            name: suggestion,
            votes: 0,
            created: new Date()
        };
        save();
        res.status(201).send(req.path);
    }
});

router.get('/:id', function(req, res) {
    var id = req.params.id;
    if(suggestions[id]) {
        res.send(suggestions[id]);
    } else {
        res.status(404).end()
    }
});

router.post('/:id', function(req, res) {
    var id = req.params.id;
    if(suggestions[id]) {
        suggestions[id].votes++;
        save();
        res.status(200).end();
    } else {
        res.status(404).end()
    }
});

module.exports = router;
