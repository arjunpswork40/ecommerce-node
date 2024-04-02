const { makeJsonResponse } = require("../../../../utils/response");
const { body, validationResult } = require('express-validator');

const verifyOTPValidator = [
    body('mobileNumber')
        .matches(/^[0-9]{10}$/)
        .withMessage('Please enter a valid 10-digit mobile number'),
    body('otp')
        .matches(/^[0-9]{10}$/)
        .withMessage('Please enter a valid OTP'),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {

            let response = makeJsonResponse(`Validation error.`, {}, errors.array(), 400, false);
            return res.status(400).json(response);
        }
        next();
    }
];
module.exports = { verifyOTPValidator };
