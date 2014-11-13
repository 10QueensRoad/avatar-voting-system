var users = require('../routes/users');
console.log('AUTH_ENABLED: ' + !!process.env.AUTH_ENABLED);

function filter(req, res, next) {
    if (!process.env.AUTH_ENABLED || req.session.user || users.validate(req.headers.user_token)) {
        next();
    } else {
        res.status(401).end();
    }
}

exports.filter = filter;