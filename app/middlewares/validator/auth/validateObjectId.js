const { makeJsonResponse } = require("../../../../utils/response");
const mongoose = require("mongoose");

const isValidObjectId = (id) => {
  return mongoose.Types.ObjectId.isValid(id);
};

module.exports = {
  validateUserId: (req, res, next) => {
    const id = req.params.id;

    if (!isValidObjectId(id)) {
      let response = makeJsonResponse("Invalid user id", {}, [], 400, false);
      return res.status(400).json(response);
    }
    next();
  },
};
