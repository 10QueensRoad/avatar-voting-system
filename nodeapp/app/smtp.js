var nodemailer = require('nodemailer');

// create reusable transport method (opens pool of SMTP connections)
module.exports = nodemailer.createTransport("SMTP",{
    service: "Gmail",
    auth: {
        user: "robot1.yanhui@gmail.com",
        pass: "yanhui's robot1"
    }
});
