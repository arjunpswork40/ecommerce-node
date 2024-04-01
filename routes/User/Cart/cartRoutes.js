const express = require("express");
const router = express.Router();
const verifier=require('../../../app/middlewares/auth/tokenVerifier')

const {
    addToCart,
    getCartItems,
    deleteCartItem,
    clearCart,
    updateQuantity
} = require('../../../app/controllers/User/Cart/cartController')

//add to cart
router.post("/addToCart",verifier.tokenVerifier,addToCart)

//get items in the cart
router.get('/cartItems',verifier.tokenVerifier,getCartItems)

//delete item from the cart
router.delete('/removeItem/:productId',verifier.tokenVerifier,deleteCartItem)

//clear cart
router.delete('/clearCart',verifier.tokenVerifier,clearCart)

//update item quantity
router.put('/updateQuantity',verifier.tokenVerifier,updateQuantity)


module.exports = router;