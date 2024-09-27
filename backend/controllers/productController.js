const Product = require("../models/productModel");

exports.createProduct = async (req, res) => {
  const { name, description, price, image, category, quantity } = req.body;

  try {
    const product = new Product({
      name,
      description,
      price,
      image,
      category,
      quantity,
    });
    await product.save();
    return res.status(201).json({
      status: "success",
      data: product,
    });
  } catch (error) {
    return res.status(400).json({
      status: "error",
      message: error.message,
    });
  }
};
