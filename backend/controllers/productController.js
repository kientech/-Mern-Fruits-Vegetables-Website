const Product = require("../models/productModel");
const slugify = require("slugify");

exports.createProduct = async (req, res) => {
  const { name, description, price, image, category, quantity } = req.body;
  try {
    const slug = slugify(name, { lower: true, strict: true });
    const product = new Product({
      name,
      description,
      price,
      image,
      category,
      quantity,
      slug,
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

exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();
    return res.status(201).json({
      status: "success",
      length: products.length,
      data: products,
    });
  } catch (error) {
    return res.status(400).json({
      status: "error",
      message: error.message,
    });
  }
};

// Lấy sản phẩm theo slug
exports.getProductBySlug = async (req, res) => {
  const { slug } = req.params;

  try {
    const product = await Product.findOne({ slug }).populate("category");
    if (!product) {
      return res.status(404).json({
        status: "error",
        message: "Product not found",
      });
    }
    return res.status(200).json({
      status: "success",
      data: product,
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};

// Cập nhật sản phẩm theo slug
exports.updateProductBySlug = async (req, res) => {
  const { slug } = req.params;
  const { name, description, price, image, category, quantity } = req.body;

  try {
    const product = await Product.findOneAndUpdate(
      { slug },
      {
        name,
        description,
        price,
        image,
        category,
        quantity,
        slug: slugify(name, { lower: true, strict: true }),
      },
      { new: true }
    );

    if (!product) {
      return res.status(404).json({
        status: "error",
        message: "Product not found",
      });
    }

    return res.status(200).json({
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

// Xóa sản phẩm theo slug
exports.deleteProductBySlug = async (req, res) => {
  const { slug } = req.params;

  try {
    const product = await Product.findOneAndDelete({ slug });

    if (!product) {
      return res.status(404).json({
        status: "error",
        message: "Product not found",
      });
    }

    return res.status(204).json({
      status: "success",
      message: "Product deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};

// Lấy sản phẩm theo danh mục
exports.getProductsByCategory = async (req, res) => {
  const { categoryId } = req.params;

  try {
    const products = await Product.find({ category: categoryId }).populate(
      "category"
    );

    if (products.length === 0) {
      return res.status(404).json({
        status: "error",
        message: "No products found in this category",
      });
    }

    return res.status(200).json({
      status: "success",
      length: products.length,
      data: products,
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};
