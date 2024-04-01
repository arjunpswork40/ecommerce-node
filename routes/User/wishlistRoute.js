const express = require("express");
const router = express.Router();
const tokenVerifier = require("../../app/middlewares/auth/tokenVerifier")

const {
    addToWishlist
} = require('../../app/controllers/User/wishlist/wishlistController')

router.put("/addToWishlist",tokenVerifier.tokenVerifier,addToWishlist)


module.exports = router;