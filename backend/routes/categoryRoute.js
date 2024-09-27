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

module.exports = router;
