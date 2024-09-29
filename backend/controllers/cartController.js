const Cart = require("../models/cartModel");
const Product = require("../models/productModel");

// Calculate the total price of the cart
const calculateTotalPrice = (cart) => {
  return cart.items.reduce((total, item) => {
    const productPrice = item.product.price;

    if (isNaN(productPrice)) {
      throw new Error(
        `Invalid product price for product ID: ${item.product._id}`
      );
    }

    return total + item.quantity * productPrice;
  }, 0);
};

// Add product to the cart
exports.addToCart = async (req, res) => {
  const { productId, quantity } = req.body;
  const userId = req.user._id; // Lấy user từ token hoặc session

  try {
    // Tìm sản phẩm trong CSDL
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        status: "error",
        message: "Product not found",
      });
    }

    // Kiểm tra xem giá của sản phẩm có hợp lệ không
    if (isNaN(product.price)) {
      return res.status(400).json({
        status: "error",
        message: "Invalid product price",
      });
    }

    // Tìm hoặc tạo giỏ hàng cho người dùng
    let cart = await Cart.findOne({ user: userId });

    if (!cart) {
      cart = new Cart({ user: userId, items: [] });
    }

    // Kiểm tra sản phẩm đã có trong giỏ hàng hay chưa
    const cartItemIndex = cart.items.findIndex(
      (item) => item.product.toString() === productId
    );

    if (cartItemIndex > -1) {
      // Sản phẩm đã có, cập nhật số lượng
      cart.items[cartItemIndex].quantity += quantity;
    } else {
      // Thêm sản phẩm mới vào giỏ hàng
      cart.items.push({ product: productId, quantity });
    }

    // Populate để lấy thông tin sản phẩm bao gồm giá
    cart = await cart.populate("items.product");

    // Tính toán tổng giá
    cart.totalPrice = calculateTotalPrice(cart);

    await cart.save();

    return res.status(200).json({
      status: "success",
      data: cart,
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};

// Get the user's cart
exports.getCart = async (req, res) => {
  const userId = req.user._id;

  try {
    const cart = await Cart.findOne({ user: userId }).populate(
      "items.product",
      "name price"
    );

    if (!cart) {
      return res.status(404).json({
        status: "error",
        message: "Cart not found",
      });
    }

    return res.status(200).json({
      status: "success",
      totalItems: cart.items.length,
      data: cart,
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};

// Update the quantity of a product in the cart
exports.updateCartItem = async (req, res) => {
  const { productId, quantity } = req.body;
  const userId = req.user._id;

  try {
    if (quantity <= 0) {
      return res.status(400).json({
        status: "error",
        message: "Quantity must be greater than 0",
      });
    }

    const cart = await Cart.findOne({ user: userId }).populate("items.product");
    console.log("🚀 ~ exports.updateCartItem= ~ cart:", cart)

    if (!cart) {
      return res.status(404).json({
        status: "error",
        message: "Cart not found",
      });
    }

    const cartItemIndex = cart.items.findIndex(
      (item) => item.product._id.toString() === productId
    );

    if (cartItemIndex === -1) {
      return res.status(404).json({
        status: "error",
        message: "Product not found in cart",
      });
    }

    cart.items[cartItemIndex].quantity = quantity;

    cart.totalPrice = calculateTotalPrice(cart);

    await cart.save();

    return res.status(200).json({
      status: "success",
      data: cart,
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};

// Remove a product from the cart
exports.removeFromCart = async (req, res) => {
  const { productId } = req.body;
  const userId = req.user._id;

  try {
    const cart = await Cart.findOne({ user: userId });
    if (!cart) {
      return res.status(404).json({
        status: "error",
        message: "Cart not found",
      });
    }

    cart.items = cart.items.filter(
      (item) => item.product.toString() !== productId
    );

    cart.totalPrice = calculateTotalPrice(cart);

    await cart.save();

    return res.status(200).json({
      status: "success",
      data: cart,
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};

// Clear the entire cart
exports.clearCart = async (req, res) => {
  const userId = req.user._id;

  try {
    const cart = await Cart.findOneAndDelete({ user: userId });

    if (!cart) {
      return res.status(404).json({
        status: "error",
        message: "Cart not found",
      });
    }

    return res.status(204).json({
      status: "success",
      message: "Cart cleared successfully",
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};
