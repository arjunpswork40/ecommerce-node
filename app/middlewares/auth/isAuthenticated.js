const { makeJsonResponse } = require("../../../utils/response")
module.exports = {
    isAuthenticated: (req, res, next) => {
        if (req.isAuthenticated()) {
            return next();
        }
        res.redirect('/admin/login');
    },
    isApiAuthenticated: (req, res, next) => {
        let apiAuthKeyFromRequest = req.headers['api-auth-key'];
        let apiAuthKey = process.env.API_AUTH_KEY || '$123EA$456$9633972298$';
        if (apiAuthKeyFromRequest) {
            if (apiAuthKey === apiAuthKeyFromRequest) {
                return next();
            } else {
                let response = makeJsonResponse(`Unauthenticated API request`, {}, {}, 401, false);
                res.status(401).json(response);
            }
        } else {
            let response = makeJsonResponse(`Unauthenticated API request`, {}, {}, 401, false);
            res.status(401).json(response);
        }

    }

}