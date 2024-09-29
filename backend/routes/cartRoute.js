const express = require("express");
const cartController = require("../controllers/cartController");
const {
  authMiddleware,
  adminMiddleware,
} = require("../middleware/authMiddleware");
const router = express.Router();

router
  .route("/")
  .get(authMiddleware, cartController.getCart) 
  .post(authMiddleware, cartController.addToCart) 
  .delete(authMiddleware, cartController.clearCart); 

router
  .route("/item/")
  .patch(authMiddleware, cartController.updateCartItem) 
  .delete(authMiddleware, cartController.removeFromCart); 

module.exports = router;
