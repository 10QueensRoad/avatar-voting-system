var Firebase = require("firebase");

var url = process.env.FIREBASE_URL || 'https://avtar-voting.firebaseio.com/';
console.log('Using Firebase url: ' + url);

var myFirebaseRef = new Firebase(url);

module.exports = myFirebaseRef;