const express = require("express");
const {
  authMiddleware,
  adminMiddleware,
} = require("../middleware/authMiddleware");
const router = express.Router();
const orderController = require("../controllers/orderController");

// Route to create a new order
router.post("/create", authMiddleware, orderController.createOrder);

// Route to get a user's orders
router.get("/my-orders", authMiddleware, orderController.getUserOrders);

// Route to update order status (admin only)
router.patch(
  "/update-status",
  authMiddleware,
  adminMiddleware,
  orderController.updateOrderStatus
);

module.exports = router;
