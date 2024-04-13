const { body, validationResult } = require('express-validator');
const { makeJsonResponse } = require('../../../../utils/response')

const productValidator = [
  // Validate name
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Name is required'),

  // Validate tag line
  body('tag_line')
    .trim()
    .notEmpty()
    .withMessage('Tag line is required'),

  // Validate description
  body('description')
    .trim()
    .notEmpty()
    .withMessage('Description is required'),

  // Validate price_by_ml array
  body('price_by_ml')
    .isArray({ min: 1 })
    .withMessage('Price by ml should be an array with at least one item'),

  // Validate category_ids array
  body('category_ids')
    .isArray({ min: 1 })
    .withMessage('Category IDs should be an array with at least one item'),

  // Validate related_item_ids array
  body('related_item_ids')
    .isArray()
    .withMessage('Related item IDs should be an array'),

  // Validate tags array
  body('tags')
    .optional()
    .isArray()
    .withMessage('Tags should be an array'),

  // Validate fragrance
  body('fragrance')
    .trim()
    .notEmpty()
    .withMessage('Fragrance is required'),

  // Validate bottle_color
  body('bottle_color')
    .trim()
    .notEmpty()
    .withMessage('Bottle color is required'),

  // Validate items_in_the_box array
  body('items_in_the_box')
    .optional()
    .isArray()
    .withMessage('Items in the box should be an array'),

  // Validate offer_deduction_percentage
  body('offer_deduction_percentage')
    .optional()
    .isNumeric()
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
  productValidator
};
