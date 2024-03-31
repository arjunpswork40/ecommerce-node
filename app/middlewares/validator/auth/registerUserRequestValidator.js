const { makeJsonResponse } = require("../../../../utils/response");
const { body, validationResult } = require('express-validator');
const validator = require('validator');

const registerUserRequestValidator = [
    body('email').isEmail().withMessage('Please enter a valid email address'),
    body('password')
        .isLength({ min: 8 })
        .withMessage('Password must be at least 8 characters')
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
        .withMessage('Password must contain at least one lowercase letter, one uppercase letter, one number, and one special character'),
    body('passwordConfirmation')
        .custom((value, { req }) => {
            if (value !== req.body.password) {
            throw new Error('Password confirmation does not match password');
            }
            return true;
        }),
    body('mobileNumber')
        .matches(/^[0-9]{10}$/)
        .withMessage('Please enter a valid 10-digit mobile number'),
    body('first_name')
        .notEmpty()
        .withMessage('First name cannot be empty')
        .isLength({ min: 2 })
        .withMessage('First name must have at least two characters'),
    body('last_name')
        .notEmpty()
        .withMessage('Last name cannot be empty')
        .isLength({ min: 1 })
        .withMessage('Last name must have at least one character'),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {

            response = makeJsonResponse(`Validation error.`, {}, errors.array(), 400, false);
            return res.status(400).json(response);
        }
        next();
    }
];
module.exports = { registerUserRequestValidator };
