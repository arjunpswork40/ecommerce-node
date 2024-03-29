const csurf = require('csurf');
const cookieParser = require('cookie-parser');

const csrfProtection = csurf({
    cookie: true,
    ignoreMethods: ['GET', 'HEAD', 'OPTIONS'],
    value: (req) => {
        return req.headers['x-csrf-token'] || req.headers['x-xsrf-token'];
    }
});

module.exports = csrfProtection;
