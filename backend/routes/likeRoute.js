const express = require("express");
const { authMiddleware } = require("../middleware/authMiddleware");
const router = express.Router();
const likeController = require("../controllers/likeController");

router.post(
  "/product/:productId/like",
  authMiddleware,
  likeController.likeProduct
);
router.post(
  "/product/:productId/unlike",
  authMiddleware,
  likeController.unlikeProduct
);
router.get(
  "/user/likes",
  authMiddleware,
  likeController.getLikedProductsByUser
);

router.get(
  "/product/:productId/likes",
  likeController.getLikesForProduct
);

module.exports = router;
