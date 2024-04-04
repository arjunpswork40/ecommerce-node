const { makeJsonResponse } = require("../../../../utils/response");
const User = require("../../../models/User");
module.exports = {
  getUnprocessedOrders: async (req, res) => {
    try {
      const unprocessedOrders = await User.find({ "order_details.status": "pending" })
        .select("order_details delivery_addresses payment")
        .populate({
          path: "order_details.product_id",
          select: "name price_by_ml fragrance bottle_color",
        });

      const response = makeJsonResponse(
        "Unprocessed orders fetched successfully",
        unprocessedOrders,
        [],
        200,
        true
      );
      res.status(200).json(response);
    } catch (error) {
      console.error("Error fetching unprocessed orders:", error);
      const response = makeJsonResponse(
        "Failed to fetch unprocessed orders",
        {},
        [error.message],
        500,
        false
      );
      res.status(500).json(response);
    }
  },

  // change status to processing
  markOrderAsProcessed: async (req, res) => {
    try {
      const orderId = req.params.orderId;

      const updatedUser = await User.findOneAndUpdate(
        { "order_details._id": orderId },
        { $set: { "order_details.$.status": "processed" } },
        { new: true }
      );

      if (!updatedUser) {
        throw new Error("Order not found");
      }

      const response = makeJsonResponse(
        "Order marked as processed successfully",
        {},
        [],
        200,
        true
      );
      res.status(200).json(response);
    } catch (error) {
      console.error("Error marking order as processed:", error);
      const response = makeJsonResponse(
        "Failed to mark order as processed",
        {},
        [error.message],
        500,
        false
      );
      res.status(500).json(response);
    }
  },

  // change order status to completed
  markOrderAsCompleted: async (req, res) => {
    try {
      const orderId = req.params.orderId;

      const updatedUser = await User.findOneAndUpdate(
        { "order_details._id": orderId },
        { $set: { "order_details.$.status": "completed" } },
        { new: true }
      );

      if (!updatedUser) {
        throw new Error("Order not found");
      }

      const response = makeJsonResponse(
        "Order marked as completed successfully",
        {},
        [],
        200,
        true
      );
      res.status(200).json(response);
    } catch (error) {
      console.error("Error changing status:", error);
      const response = makeJsonResponse(
        "Failed to change status",
        {},
        [error.message],
        500,
        false
      );
      res.status(500).json(response);
    }
  },
};
