const express = require("express");
const { authMiddleware } = require("../middleware/authMiddleware");
const router = express.Router();
const reviewController = require("../controllers/reviewController");

router.post(
  "/product/:productId/reviews",
  authMiddleware,
  reviewController.createReview
);

router.get("/product/:productId/reviews", reviewController.getReviewsByProduct);
router.patch(
  "/reviews/:reviewId",
  authMiddleware,
  reviewController.updateReview
);
router.delete(
  "/reviews/:reviewId",
  authMiddleware,
  reviewController.deleteReview
);

module.exports = router;
