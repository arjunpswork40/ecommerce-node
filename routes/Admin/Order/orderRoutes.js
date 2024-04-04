const express = require("express");
const router = express.Router();

const {
  getUnprocessedOrders,
  markOrderAsCompleted,
  markOrderAsProcessed
} = require('../../../app/controllers/Admin/Orders/orderController')

//list all users
router.get('/allOrders',getUnprocessedOrders)

// change status to processing
router.put('/changeStatusToProcessed/:orderId',markOrderAsProcessed)

// change status to processing
router.put('/changeStatusToCompleted/:orderId',markOrderAsCompleted)

module.exports = router;