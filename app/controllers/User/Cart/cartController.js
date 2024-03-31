const User = require("../../../models/User");
const { makeJsonResponse } = require("../../../../utils/response");

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
      const userId = req.user;
      const { product_id, quantity } = req.body;

      // Fetch the user
      const user = await User.findById(userId);
      if (!user) {
        responseData.success = false;
        responseData.httpStatusCode = 404;
        responseData.message = "User not found";
        throw new Error("User not found");
      }

      // Check if the product is already in the cart
      const existingCartItem = user.cart_products.find((item) => item.product_id === product_id);

      if (existingCartItem) {
        // If the product is already in the cart, update its quantity
        existingCartItem.quantity += quantity;
        responseData.message = "Quantity of the carted product updated";
      } else {
        // If the product is not in the cart, add it as a new item
        user.cart_products.push({ product_id, quantity });
        responseData.message = "Product added to cart";
      }

      // Save the user with updated cart
      await user.save();

      responseData.success = true;
      responseData.httpStatusCode = 200;
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
  getCartItems : async (req, res) => {
    try {
      const userId = req.user;
      const user = await User.findById(userId).populate('cart_products.product_id');
  
      if (!user) {
        responseData.success = false;
        responseData.httpStatusCode = 404;
        responseData.message = "User not found";
        throw new Error("User not found");
      }
  
      const cartItems = user.cart_products.map(item => ({
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
  deleteCartItem : async (req, res) => {
    try {
      const userId = req.user;
      const productId = req.params.productId;
  
      // Fetch the user
      const user = await User.findById(userId);
  
      // Check if the user exists
      if (!user) {
        responseData.httpStatusCode = 404;
        responseData.message = "User not found";
        throw new Error("User not found");
      }
  
      // Find the index of the item in the cart
      const itemIndex = user.cart_products.findIndex(item => item.product_id === productId);
  
      // Check if the item exists in the cart
      if (itemIndex === -1) {
        responseData.httpStatusCode = 404;
        responseData.message = "Item not found in the cart";
        throw new Error("Item not found in the cart");
      }
  
      // Remove the item from the cart
      user.cart_products.splice(itemIndex, 1);
  
      // Save the updated user document
      await user.save();
  
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
  clearCart : async (req, res) => {
    try {
      const userId = req.user;
      
      // Fetch the user
      const user = await User.findById(userId);
  
      // Check if the user exists
      if (!user) {
        responseData.httpStatusCode = 404;
        responseData.message = "User not found";
        throw new Error("User not found");
      }
  
      // Clear the cart products array
      user.cart_products = [];
  
      // Save the updated user document
      await user.save();
  
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
  updateQuantity : async (req, res) => {
    try {
      const userId = req.user;
      const { productId, newQuantity } = req.body;
  
      // Fetch the user
      const user = await User.findById(userId);
  
      // Check if the user exists
      if (!user) {
        responseData.httpStatusCode = 404;
        responseData.message = "User not found";
        throw new Error("User not found");
      }
  
      // Find the cart product by productId
      const cartProduct = user.cart_products.find((product) => product.product_id === productId);
  
      // Check if the cart product exists
      if (!cartProduct) {
        responseData.httpStatusCode = 404;
        responseData.message = "Item not found in the cart";
        throw new Error("Item not found in the cart");
      }

      // Update the quantity of the item
      cartProduct.quantity = newQuantity;

      // Save the user with updated cart
      await user.save();
  
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
  }
  
};
