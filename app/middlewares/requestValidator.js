const { body, validationResult } = require('express-validator');
const { makeJsonResponse } = require("../../utils/response");

exports.validateFeedback = [
    body('name').isLength({ min: 3 }).withMessage('Name must be at least 3 characters'),
    body('comment').isLength({ min: 5 }).withMessage('Comment must be atleast 5 characters'),

    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {

            response = makeJsonResponse(`Validation error.`, {}, errors.array(), 400, false);
            return res.status(400).json(response);
        }
        next();
    }
];