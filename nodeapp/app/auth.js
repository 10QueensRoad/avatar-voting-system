var users = require('../routes/users');

function filter(req, res, next) {
    if (req.session.user || users.validate(req.headers.user_token)) {
        next();
    } else {
        res.status(401).end();
    }
}

exports.filter = filter;