const express = require("express");
const router = express.Router();

const {
    loginAdmin,
    SendOtp,
    verifyOtp,
    UpdatePassword
} = require('../../../app/controllers/Admin/Auth/adminAuthController')

//admin login
router.post('/login',loginAdmin)

//send otp when resetting password
router.post('/resetPassword/sendOtp',SendOtp)

//verify the otp 
router.post('/resetPassword/verifyOtp',verifyOtp)

//update the password
router.post('/resetPassword/updatePassword',UpdatePassword)

module.exports = router;