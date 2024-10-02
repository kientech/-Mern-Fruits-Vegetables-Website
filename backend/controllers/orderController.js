const Order = require("../models/orderModel");
const Cart = require("../models/cartModel");

// Create a new order
exports.createOrder = async (req, res) => {
  const userId = req.user._id;

  try {
    // Fetch the user's cart
    const cart = await Cart.findOne({ user: userId }).populate("items.product");

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({
        status: "error",
        message: "Cart is empty",
      });
    }

    // Create a new order
    const newOrder = new Order({
      user: userId,
      items: cart.items,
      totalPrice: cart.totalPrice,
      status: "pending", // Default status
    });

    // Save the order
    await newOrder.save();

    // Optionally, clear the user's cart after placing the order
    await Cart.findOneAndDelete({ user: userId });

    return res.status(201).json({
      status: "success",
      data: newOrder,
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};

// Get a user's orders
exports.getUserOrders = async (req, res) => {
  const userId = req.user._id;

  try {
    const orders = await Order.find({ user: userId }).populate("items.product");

    if (!orders) {
      return res.status(404).json({
        status: "error",
        message: "No orders found",
      });
    }

    return res.status(200).json({
      status: "success",
      data: orders,
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};

// Update the status of an order (admin-only functionality)
exports.updateOrderStatus = async (req, res) => {
  const { orderId, status } = req.body;

  try {
    // Ensure the status is one of the allowed values
    const allowedStatuses = ["pending", "completed", "canceled"];
    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        status: "error",
        message: "Invalid status",
      });
    }

    // Find and update the order status
    const order = await Order.findByIdAndUpdate(
      orderId,
      { status },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({
        status: "error",
        message: "Order not found",
      });
    }

    return res.status(200).json({
      status: "success",
      data: order,
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};
