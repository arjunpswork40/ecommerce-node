const express = require("express");
const router = express.Router();

const {
    createCheckoutSession
} = require('../../../app/controllers/User/Payments/userPaymentController')

router.post("/create-checkout-session",createCheckoutSession)


module.exports = router;