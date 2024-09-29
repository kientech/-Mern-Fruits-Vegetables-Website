const Like = require("../models/likeModel");

exports.likeProduct = async (req, res) => {
  const { productId } = req.params;
  const userId = req.user._id;

  try {
    const existingLike = await Like.findOne({
      product: productId,
      user: userId,
    });

    if (existingLike) {
      return res.status(400).json({
        status: "error",
        message: "You have already liked this product",
      });
    }

    const like = new Like({
      product: productId,
      user: userId,
    });

    await like.save();

    return res.status(201).json({
      status: "success",
      message: "Product liked successfully",
      data: like,
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};

exports.unlikeProduct = async (req, res) => {
  const { productId } = req.params;
  const userId = req.user._id;

  try {
    const like = await Like.findOneAndDelete({
      product: productId,
      user: userId,
    });

    if (!like) {
      return res.status(404).json({
        status: "error",
        message: "You haven't liked this product",
      });
    }

    return res.status(200).json({
      status: "success",
      message: "Product unliked successfully",
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};

exports.getLikedProductsByUser = async (req, res) => {
  const userId = req.user._id;

  try {
    const likes = await Like.find({ user: userId }).populate("product");

    return res.status(200).json({
      status: "success",
      length: likes.length,
      data: likes.map((like) => like.product),
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};

exports.getLikesForProduct = async (req, res) => {
  const { productId } = req.params;

  try {
    const likes = await Like.find({ product: productId }).populate(
      "user",
      "name avatar username"
    );

    return res.status(200).json({
      status: "success",
      length: likes.length,
      data: likes,
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};
