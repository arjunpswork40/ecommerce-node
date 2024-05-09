const { body, validationResult } = require('express-validator');
const { makeJsonResponse } = require('../../../../utils/response')

const productUpdateValidator = [
  // Validate name
  body('name')
    .trim()
    .optional()
    .notEmpty()
    .withMessage('Name is required'),

  // Validate tag line
  body('tag_line')
    .trim()
    .optional()
    .notEmpty()
    .withMessage('Tag line is required'),

  // Validate description
  body('description')
    .trim()
    .optional()
    .notEmpty()
    .withMessage('Description is required'),

  // Validate price_by_ml array
  body('price_by_ml')
    .notEmpty()
    .optional()
    .withMessage('Price by ml is required'),

  // Validate category_ids array
  body('category_ids')
    .isArray({ min: 1 })
    .optional()
    .withMessage('Category IDs should be an array with at least one item'),

  // Validate related_item_ids array
  body('related_item_ids')
    .isArray()
    .optional()
    .withMessage('Related item IDs should be an array'),

  // Validate tags array
  body('tags')
    .optional()
    .isArray()
    .withMessage('Tags should be an array'),

  // Validate fragrance
  body('fragrance')
    .trim()
    .optional()
    .notEmpty()
    .withMessage('Fragrance is required'),

  // Validate bottle_color
  body('bottle_color')
    .trim()
    .optional()
    .notEmpty()
    .withMessage('Bottle color is required'),

  // Validate items_in_the_box array
  body('items_in_the_box')
    .notEmpty()
    .optional()
    .withMessage('Items in the box is required'),

  // Validate offer_deduction_percentage
  body('offer_deduction_percentage')
    .isNumeric()
    .optional()
    .withMessage('Offer deduction percentage should be a numeric value'),

  // Validate offers array
  body('offers')
    .optional()
    .isArray()
    .withMessage('Offers should be an array'),

  // Check for validation errors
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const errorMessages = errors.array().map(error => error.msg);
      return res.status(400).json(makeJsonResponse('not valid inputs',[],[errorMessages],400,false));
    }
    // If validation passes, proceed
    next();
  }
];

module.exports = {
  productUpdateValidator
};
