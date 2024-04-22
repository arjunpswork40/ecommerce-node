const { makeJsonResponse } = require("../../../../utils/response");
const { body, validationResult } = require('express-validator');
const validator = require('validator');

const adminLoginValidator = [
    body('email')
        .isEmail()
        .withMessage('Please enter a valid email'),
    body('password')
        .notEmpty()
        .withMessage('Password cannot be empty'),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {

            let response = makeJsonResponse(`Validation error.`, {}, errors.array(), 400, false);
            return res.status(400).json(response);
        }
        next();
    }
];
module.exports = { adminLoginValidator };
