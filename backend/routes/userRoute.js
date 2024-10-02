const express = require("express");
const userController = require("../controllers/userController");
const {
  authMiddleware,
  adminMiddleware,
} = require("../middleware/authMiddleware");
const { upload } = require("../controllers/uploadController");
const router = express.Router();

router.get("/my-profile", authMiddleware, userController.getUser);
router.get("/user/:id", userController.getUserById);
router.patch(
  "/profile",
  authMiddleware,
  upload.single("avatar"),
  userController.updateUser
);
router.get("/", authMiddleware, adminMiddleware, userController.getAllUsers);
router.delete(
  "/:id",
  authMiddleware,
  adminMiddleware,
  userController.deleteUser
);

module.exports = router;
