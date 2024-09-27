const Category = require("../models/categoryModel");

exports.createCategory = async (req, res) => {
  const { name, description } = req.body;

  try {
    const category = new Category({ name, description });
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
