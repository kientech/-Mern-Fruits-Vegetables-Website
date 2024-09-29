const Review = require("../models/reviewModel");
const Product = require("../models/productModel");

// Tạo review mới
exports.createReview = async (req, res) => {
  const { productId } = req.params;
  const { rating, comment } = req.body;
  const userId = req.user._id; // Giả sử bạn sử dụng middleware để lấy user từ token

  try {
    // Kiểm tra nếu sản phẩm tồn tại
    const product = await Product.findById(productId);
    if (!product) {
      return res
        .status(404)
        .json({ status: "error", message: "Product not found" });
    }

    // Kiểm tra nếu người dùng đã đánh giá sản phẩm này trước đó
    const existingReview = await Review.findOne({
      user: userId,
      product: productId,
    });
    if (existingReview) {
      return res.status(400).json({
        status: "error",
        message: "You have already reviewed this product",
      });
    }

    const review = new Review({
      product: productId,
      user: userId,
      rating,
      comment,
    });

    await review.save();

    return res.status(201).json({
      status: "success",
      data: review,
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};

// Lấy tất cả review của một sản phẩm
exports.getReviewsByProduct = async (req, res) => {
  const { productId } = req.params;

  try {
    const reviews = await Review.find({ product: productId }).populate(
      "user",
      "name avatar username"
    );
    return res.status(200).json({
      status: "success",
      length: reviews.length,
      data: reviews,
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};

// Cập nhật review
exports.updateReview = async (req, res) => {
  const { reviewId } = req.params;
  const { rating, comment } = req.body;
  const userId = req.user._id; // Lấy userId từ middleware xác thực

  try {
    // Tìm review
    const review = await Review.findById(reviewId);

    if (!review) {
      return res.status(404).json({
        status: "error",
        message: "Review not found",
      });
    }

    // Kiểm tra xem người dùng có phải là người tạo review hay không
    if (review.user.toString() !== userId.toString()) {
      return res.status(403).json({
        status: "error",
        message: "You are not authorized to update this review",
      });
    }

    // Cập nhật review
    review.rating = rating;
    review.comment = comment;

    await review.save();

    return res.status(200).json({
      status: "success",
      data: review,
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};

// Xóa review
exports.deleteReview = async (req, res) => {
  const { reviewId } = req.params;
  const userId = req.user._id; // Lấy userId từ middleware xác thực

  try {
    // Tìm review
    const review = await Review.findById(reviewId);

    if (!review) {
      return res.status(404).json({
        status: "error",
        message: "Review not found",
      });
    }

    // Kiểm tra xem người dùng có phải là người tạo review hay không
    if (review.user.toString() !== userId.toString()) {
      return res.status(403).json({
        status: "error",
        message: "You are not authorized to delete this review",
      });
    }

    // Xóa review
    await review.remove();

    return res.status(204).json({
      status: "success",
      message: "Review deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};
