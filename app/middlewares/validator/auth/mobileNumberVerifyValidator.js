const { makeJsonResponse } = require("../../../../utils/response");
const { body, validationResult } = require('express-validator');

const mobileNumberVerifyValidator = [
    body('mobileNumber')
        .matches(/^[0-9]{10}$/)
        .withMessage('Please enter a valid 10-digit mobile number'),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {

            let response = makeJsonResponse(`Validation error.`, {}, errors.array(), 400, false);
            return res.status(400).json(response);
        }
        next();
    }
];
module.exports = { mobileNumberVerifyValidator };
