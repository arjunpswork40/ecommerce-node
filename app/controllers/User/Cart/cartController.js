const User = require("../../../models/User");
const { makeJsonResponse } = require("../../../../utils/response");
const Product = require("../../../models/Product");
const { ObjectId } = require("bson");

let responseData = {
  message: "Some Error Occured",
  data: [],
  error: [],
  httpStatusCode: 500,
  status: false,
};

module.exports = {
  // Add items to the cart
  addToCart: async (req, res) => {
    try {
      const { productId, quantity } = req.body;

      // Fetch the user
      let user = req.userData;
      let product = await Product.findById(new ObjectId(productId)).select("_id");

      if (product) {
        // Check if the product is already in the cart
        const existingCartItem = user.cart_products.find((item) =>
          item.product_id.equals(new ObjectId(productId))
        );

        console.log("existingCartItem=>", existingCartItem);
        if (existingCartItem) {
          // If the product is already in the cart, update its quantity
          existingCartItem.quantity += parseInt(quantity);
          responseData.message = "Quantity of the carted product updated";
        } else {
          // If the product is not in the cart, add it as a new item
          user.cart_products.push({
            product_id: new ObjectId(productId),
            quantity: parseInt(quantity)
          });
          responseData.message = "Product added to cart";
        }

        let userUpdate = await User.findByIdAndUpdate(
          user._id,
          { $set: { cart_products: user.cart_products } },
          { new: true }
        );

        responseData.success = true;
        responseData.httpStatusCode = 200;
        responseData.data = userUpdate;
      } else {
        responseData.httpStatusCode = 404;
        responseData.message = "Product not found";
      }
    } catch (error) {
      console.error(error);
      responseData.error.push(error.message);
    }
    const response = makeJsonResponse(
      responseData.message,
      responseData.data,
      responseData.error,
      responseData.httpStatusCode,
      responseData.success
    );
    return res.status(responseData.httpStatusCode).json(response);
  },

  //get cart items
  getCartItems: async (req, res) => {
    try {
      const user = req.userData;
      const userCartData = await user.populate("cart_products.product_id");

      const cartItems = userCartData.cart_products.map((item) => ({
        productId: item.product_id._id,
        productName: item.product_id.name,
        quantity: item.quantity,
        price: item.product_id.price_by_ml,
      }));

      responseData.success = true;
      responseData.httpStatusCode = 200;
      responseData.data = cartItems;
      responseData.message = "Cart items retrieved successfully";
    } catch (error) {
      console.error(error);
      responseData.error.push(error.message);
    }

    const response = makeJsonResponse(
      responseData.message,
      responseData.data,
      responseData.error,
      responseData.httpStatusCode,
      responseData.success
    );

    return res.status(responseData.httpStatusCode).json(response);
  },

  //delete item from cart
  deleteCartItem: async (req, res) => {
    try {
      const productId = req.params.productId;
      const user = req.userData;

      // Find the index of the item in the cart
      const itemIndex = user.cart_products.findIndex((item) =>
        item.product_id.equals(new ObjectId(productId))
      );

      // Check if the item exists in the cart
      if (itemIndex === -1) {
        responseData.httpStatusCode = 404;
        responseData.message = "Item not found in the cart";
        throw new Error("Item not found in the cart");
      }

      // Remove the item from the cart
      await User.findOneAndUpdate(
        { _id: user._id },
        { $pull: { cart_products: { product_id: new ObjectId(productId) } } }
      );

      // Set success response data
      responseData.httpStatusCode = 200;
      responseData.message = "Item removed from cart successfully";
      responseData.status = true;
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

  //clear cart
  clearCart: async (req, res) => {
    try {
      const user = req.userData

      // Clear the cart products array
      await User.findOneAndUpdate(
        { _id: user._id },
        { $set: { cart_products: [] } }
      );

      // Set success response data
      responseData.httpStatusCode = 200;
      responseData.message = "Cart cleared successfully";
      responseData.status = true;
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

  //update cart item quantity
  updateQuantity: async (req, res) => {
    try {
      const { productId, newQuantity } = req.body;
      const user = req.userData

      // Find the cart product by productId
      const cartProduct = user.cart_products.find((item) =>
      item.product_id.equals(new ObjectId(productId)));
      

      // Check if the cart product exists
      if (!cartProduct) {
        responseData.httpStatusCode = 404;
        responseData.message = "Item not found in the cart";
        throw new Error("Item not found in the cart");
      }

      // Update the quantity of the item
      await User.findOneAndUpdate(
        { _id: user._id, "cart_products.product_id": new ObjectId(productId) },
        { $set: { "cart_products.$.quantity": newQuantity } }
      );

      // Set success response data
      responseData.httpStatusCode = 200;
      responseData.message = "Quantity updated successfully";
      responseData.status = true;
      responseData.data = { newQuantity, totalPrice: user.cart_total_price };
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
