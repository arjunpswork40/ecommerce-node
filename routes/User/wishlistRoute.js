const express = require("express");
const router = express.Router();
const tokenVerifier = require("../../app/middlewares/auth/tokenVerifier")

const {
    updateWishlist,
    getWishlstItem,
    clearWishlist,
    fetchProduct

} = require('../../app/controllers/User/wishlist/wishlistController')




//add to wishlist and remove
router.put("/updateWishlist",tokenVerifier.tokenVerifier,updateWishlist)

//list wishlist items
router.get('/wishlistItems',tokenVerifier.tokenVerifier, getWishlstItem)

//clear wishlist
router.delete('/clear wishlist',tokenVerifier.tokenVerifier, clearWishlist)

// fetch products from wishlist
router.get('/fetchProduct',tokenVerifier.tokenVerifier,fetchProduct)




module.exports = router;