const { makeJsonResponse } = require("../../../../utils/response");
const { body, validationResult } = require('express-validator');
const validator = require('validator');

const registerUserRequestValidator = [
    body('email').isEmail().withMessage('Please enter a valid email address'),
    body('mobileNumber')
        .matches(/^[0-9]{10}$/)
        .withMessage('Please enter a valid 10-digit mobile number'),
    body('firstName')
        .notEmpty()
        .withMessage('First name cannot be empty')
        .isLength({ min: 2 })
        .withMessage('First name must have at least two characters'),
    body('lastName')
        .notEmpty()
        .withMessage('Last name cannot be empty')
        .isLength({ min: 1 })
        .withMessage('Last name must have at least one character'),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {

            let response = makeJsonResponse(`Validation error.`, {}, errors.array(), 400, false);
            return res.status(400).json(response);
        }
        next();
    }
];
module.exports = { registerUserRequestValidator };
