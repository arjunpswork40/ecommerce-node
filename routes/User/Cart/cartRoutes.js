const express = require("express");
const router = express.Router();
const verifier=require('../../../app/middlewares/auth/tokenVerifier')
const {
    validateAddToCart,
    validateDeleteFromCart
}=require('../../../app/middlewares/cart/cartValidators')

const {
    addToCart,
    getCartItems,
    deleteCartItem,
    clearCart,
    updateQuantity
} = require('../../../app/controllers/User/Cart/cartController')

//add to cart
router.post("/addToCart",validateAddToCart,verifier.tokenVerifier,addToCart)

//get items in the cart
router.get('/cartItems',verifier.tokenVerifier,getCartItems)

//delete item from the cart
router.delete('/removeItem/:productId',validateDeleteFromCart,verifier.tokenVerifier,deleteCartItem)

//clear cart
router.delete('/clearCart',verifier.tokenVerifier,clearCart)

//update item quantity
router.put('/updateQuantity',validateAddToCart,verifier.tokenVerifier,updateQuantity)


module.exports = router;