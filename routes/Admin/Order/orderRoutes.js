const express = require("express");
const router = express.Router();

const { tokenVerifierFromDB } = require("../../../app/middlewares/auth/tokenVerifier")
const {
  getUnprocessedOrders,
  markOrderAsCompleted,
  markOrderAsProcessed
} = require('../../../app/controllers/Admin/Orders/orderController')

//list all users
router.get('/allOrders',tokenVerifierFromDB,getUnprocessedOrders)

// change status to processing
router.put('/changeStatusToProcessed/:orderId',tokenVerifierFromDB,markOrderAsProcessed)

// change status to processing
router.put('/changeStatusToCompleted/:orderId',tokenVerifierFromDB,markOrderAsCompleted)

module.exports = router;