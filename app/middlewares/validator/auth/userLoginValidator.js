const { makeJsonResponse } = require("../../../../utils/response");
const { body, validationResult } = require('express-validator');

const userLoginValidator = [
    body('mobileNumber')
        .matches(/^[0-9]{10}$/)
        .withMessage('Please enter a valid 10-digit mobile number'),
    body('password')
        .notEmpty()
        .withMessage('Password cannot be empty'),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {

            response = makeJsonResponse(`Validation error.`, {}, errors.array(), 400, false);
            return res.status(400).json(response);
        }
        next();
    }
];
module.exports = { userLoginValidator };
