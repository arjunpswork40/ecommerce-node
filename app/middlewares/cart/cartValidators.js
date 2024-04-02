const { makeJsonResponse } = require("../../../utils/response");
const mongoose = require('mongoose');

const isValidObjectId = (id) => {
  return mongoose.Types.ObjectId.isValid(id);
};

const isPositiveInteger = (quantity) => {
  return /^\d+$/.test(quantity) && parseInt(quantity) > 0;
};

module.exports={

validateAddToCart : (req, res, next) => {
  const { productId, quantity } = req.body;

  if (!isValidObjectId(productId)) {
    let response = makeJsonResponse('Invalid productId', {}, [], 400, false);
    return res.status(400).json(response);
  }

  if (!isPositiveInteger(quantity)) {
    let response = makeJsonResponse('Quantity must be a positive integer', {}, [], 400, false);
    return res.status(400).json(response);
  }
  next();
},

validateDeleteFromCart : (req, res, next) => {
    const productId = req.params.productId;
  
    if (!isValidObjectId(productId)) {
      let response = makeJsonResponse('Invalid productId', {}, [], 400, false);
      return res.status(400).json(response);
    }
    next();
  },

}