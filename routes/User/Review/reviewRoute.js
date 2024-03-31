const express = require("express");
const router = express.Router();
const verifier=require('../../../app/middlewares/auth/tokenVerifier')

const {
    addUserReview
} = require('../../../app/controllers/User/Review/reviewController')

router.post("/addReview",verifier.tokenVerifier,addUserReview)


module.exports = router;