const User = require("../../../models/User");
const Product = require("../../../models/Product");
const { makeJsonResponse } = require("../../../../utils/response");

let responseData = {
  message: "Some Error Occurred",
  data: [],
  error: [],
  httpStatusCode: 500,
  status: false,
};

module.exports = {
  //add user reviwew
  addUserReview: async (req, res) => {
    try {
      const userId = req.user;
      const { productId, rating, comment } = req.body;

      // Fetch the user
      const user = await User.findById(userId);

      // Check if the user exists
      if (!user) {
        responseData.httpStatusCode = 404;
        responseData.message = "User not found";
        throw new Error("User not found");
      }

      // Create a new review
      const newReview = {
        user_id: userId,
        rating: rating,
        review: comment,
      };

      // Add the new review to the product's reviews array
      const product = await Product.findByIdAndUpdate(
        productId,
        { $push: { review: newReview } },
        { new: true }
      );

      // Update the product's average rating
      const totalRating = product.review.reduce((sum, review) => sum + review.rating, 0);
      const averageRating = totalRating / product.review.length;

      // Update the product's rating field
      product.rating = averageRating;

      // Save the updated product
      await product.save();

      // Set success response data
      responseData.httpStatusCode = 200;
      responseData.message = "Review added successfully";
      responseData.status = true;
      responseData.data = { review: newReview };
    } catch (error) {
      console.error(error);
      responseData.error.push(error.message);
    }

    const response = makeJsonResponse(
      responseData.message,
      responseData.data,
      responseData.error,
      responseData.httpStatusCode,
      responseData.status
    );
    return res.status(responseData.httpStatusCode).json(response);
  },
};
