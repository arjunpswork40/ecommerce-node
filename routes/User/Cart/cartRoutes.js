const express = require("express");
const router = express.Router();

const {
    addToCart,
    getCartItems,
    deleteCartItem,
    clearCart,
    updateQuantity
} = require('../../../app/controllers/User/Cart/cartController')

//add to cart
router.post("/addToCart",addToCart)

//get items in the cart
router.get('/cartItems',getCartItems)

//delete item from the cart
router.delete('/removeItem/:productId',deleteCartItem)

//clear cart
router.delete('/clearCart',clearCart)

//update item quantity
router.put('/updateQuantity',updateQuantity)


module.exports = router;