const Category = require("../models/categoryModel");
const slugify = require("slugify");

exports.createCategory = async (req, res) => {
  const { name, description } = req.body;

  try {
    const slug = slugify(name, { lower: true, strict: true });

    const category = new Category({ name, description, slug });

    await category.save();
    return res.status(201).json({
      status: "success",
      data: category,
    });
  } catch (error) {
    return res.status(400).json({
      status: "error",
      message: error.message,
    });
  }
};

exports.getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    return res.status(200).json({
      status: "success",
      length: categories.length,
      data: categories,
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};

exports.updateCategory = async (req, res) => {
  const { id } = req.params; // Lấy ID từ params
  const { name, description } = req.body;

  try {
    // Nếu có tên mới thì tạo lại slug
    const slug = name
      ? slugify(name, { lower: true, strict: true })
      : undefined;

    // Cập nhật category dựa trên ID
    const updatedCategory = await Category.findByIdAndUpdate(
      id,
      { name, description, slug },
      { new: true, runValidators: true } // Trả về document đã cập nhật
    );

    if (!updatedCategory) {
      return res.status(404).json({
        status: "error",
        message: "Category not found",
      });
    }

    return res.status(200).json({
      status: "success",
      data: updatedCategory,
    });
  } catch (error) {
    return res.status(400).json({
      status: "error",
      message: error.message,
    });
  }
};

exports.deleteCategory = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedCategory = await Category.findByIdAndDelete(id);

    if (!deletedCategory) {
      return res.status(404).json({
        status: "error",
        message: "Category not found",
      });
    }

    return res.status(201).json({
      status: "success",
      message: "Category has been deleted",
    });
  } catch (error) {
    return res.status(400).json({
      status: "error",
      message: error.message,
    });
  }
};

exports.getCategoryById = async (req, res) => {
  const { id } = req.params;

  try {
    const category = await Category.findById(id);

    if (!category) {
      return res.status(404).json({
        status: "error",
        message: "Category not found",
      });
    }

    return res.status(200).json({
      status: "success",
      data: category,
    });
  } catch (error) {
    return res.status(400).json({
      status: "error",
      message: error.message,
    });
  }
};

exports.getCategoryBySlug = async (req, res) => {
  const { slug } = req.params;

  try {
    const category = await Category.findOne({ slug });

    if (!category) {
      return res.status(404).json({
        status: "error",
        message: "Category not found",
      });
    }

    return res.status(200).json({
      status: "success",
      data: category,
    });
  } catch (error) {
    return res.status(400).json({
      status: "error",
      message: error.message,
    });
  }
};
