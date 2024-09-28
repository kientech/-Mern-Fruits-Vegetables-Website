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
router.post(
  "/",
  authMiddleware,
  adminMiddleware,
  productController.createProduct
);
router.get("/", productController.getAllProducts);
router.get("/slug/:slug", productController.getProductBySlug);
router.patch(
  "/slug/:slug",
  authMiddleware,
  adminMiddleware,
  productController.updateProductBySlug
);
router.delete(
  "/slug/:slug",
  authMiddleware,
  adminMiddleware,
  productController.deleteProductBySlug
);
router.get("/category/:categoryId", productController.getProductsByCategory);

module.exports = router;
