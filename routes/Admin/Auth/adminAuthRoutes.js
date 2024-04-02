const express = require("express");
const router = express.Router();

const { adminLoginValidator }=require('../../../app/middlewares/validator/auth/adminAuthRequestValidator')
const { mobileNumberVerifyValidator } = require("../../../app/middlewares/validator/auth/mobileNumberVerifyValidator")
const { verifyOTPValidator } = require("../../../app/middlewares/validator/auth/verifyOTPValidator")
const { passwordResetValidator } = require('../../../app/middlewares/validator/auth/passwordResetValidator')

const {
    loginAdmin,
    SendOtp,
    verifyOtp,
    UpdatePassword
} = require('../../../app/controllers/Admin/Auth/adminAuthController')

//admin login
router.post('/login',adminLoginValidator,loginAdmin)

//send otp when resetting password
router.post('/resetPassword/sendOtp',mobileNumberVerifyValidator,SendOtp)

//verify the otp 
router.post('/resetPassword/verifyOtp',verifyOTPValidator,verifyOtp)

//update the password
router.post('/resetPassword/updatePassword',passwordResetValidator,UpdatePassword)

module.exports = router;