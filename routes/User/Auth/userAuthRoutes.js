const express = require("express");
const router = express.Router();
const {
    postSignup,
    verify,
    verifyOtp,
    loginData,
    forgetPass,
    verifyToken
} = require('../../../app/controllers/User/Auth/userAuthController')
const { registerUserRequestValidator } = require("../../../app/middlewares/validator/auth/registerUserRequestValidator")
const { mobileNumberVerifyValidator } = require("../../../app/middlewares/validator/auth/mobileNumberVerifyValidator")
const { verifyOTPValidator } = require("../../../app/middlewares/validator/auth/verifyOTPValidator")
const { userLoginValidator } = require("../../../app/middlewares/validator/auth/userLoginValidator")

/* GET users listing. */

router.post("/signuppost",registerUserRequestValidator,postSignup)


router.post("/send-otp",mobileNumberVerifyValidator,verify)
router.post("/login",userLoginValidator,loginData)

router.post("/verifyOTp",verifyOTPValidator,verifyOtp)
router.post("/verifyToken",verifyToken)

router.patch("/resetpass",forgetPass)


module.exports = router;