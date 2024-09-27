const express = require("express");
const {
  authMiddleware,
  adminMiddleware,
} = require("../middleware/authMiddleware");
const router = express.Router();
const productController = require("../controllers/productController");

router.post(
  "/",
  authMiddleware,
  adminMiddleware,
  productController.createProduct
);

module.exports = router;
