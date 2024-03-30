const express = require("express");
const router = express.Router();
const {
    postSignup,
    verify,
    verifyOtp,
    loginData,
    forgetPass
} = require('../../../app/controllers/User/Auth/userAuthController')
const { registerUserRequestValidator } = require("../../../app/middlewares/validator/auth/registerUserRequestValidator")
const { mobileNumberVerifyValidator } = require("../../../app/middlewares/validator/auth/mobileNumberVerifyValidator")
const { verifyOTPValidator } = require("../../../app/middlewares/validator/auth/verifyOTPValidator")

/* GET users listing. */

router.post("/signuppost",registerUserRequestValidator,postSignup)


router.post("/send-otp",mobileNumberVerifyValidator,verify)
router.post("/login-post",loginData)

router.post("/verifyOTp",verifyOTPValidator,verifyOtp)
router.patch("/resetpass",forgetPass)


module.exports = router;