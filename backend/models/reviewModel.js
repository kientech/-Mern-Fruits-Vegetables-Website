const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const reviewSchema = new Schema(
  {
    product: {
      type: Schema.Types.ObjectId,
      ref: "Product", 
      required: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User", 
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5, 
    },
    comment: {
      type: String,
      required: true,
    },
  },
  { timestamps: true } // Tự động thêm createdAt và updatedAt
);

const Review = mongoose.model("Review", reviewSchema);

module.exports = Review;
