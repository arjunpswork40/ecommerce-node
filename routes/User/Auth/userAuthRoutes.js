const express = require("express");
const router = express.Router();
const {
    postSignup,
    verify,
    verifyOtp,
    loginData,
    forgetPass
} = require('../../../app/controllers/User/Auth/userAuthController')

/* GET users listing. */

router.post("/signuppost",postSignup)


router.post("/send-otp",verify)
router.post("/login-post",loginData)

router.post("/verifyOTp",verifyOtp)
router.patch("/resetpass",forgetPass)


module.exports = router;