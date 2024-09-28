const express = require("express");
const {
  authMiddleware,
  adminMiddleware,
} = require("../middleware/authMiddleware");
const router = express.Router();
const categoryController = require("../controllers/categoryController");

router.post(
  "/",
  authMiddleware,
  adminMiddleware,
  categoryController.createCategory
);
router.get("/", categoryController.getAllCategories);
router.get("/:id", categoryController.getCategoryById);
router.get("/slug/:slug", categoryController.getCategoryBySlug);
router.patch(
  "/:id",
  authMiddleware,
  adminMiddleware,
  categoryController.updateCategory
);
router.delete(
  "/:id",
  authMiddleware,
  adminMiddleware,
  categoryController.deleteCategory
);

module.exports = router;
