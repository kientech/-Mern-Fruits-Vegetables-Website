const User = require("../models/userModel");
const crypto = require("crypto");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Register feature
exports.register = async (req, res) => {
  const { name, username, email, password } = req.body;

  try {
    const user = new User({ name, username, email, password });
    await user.save();

    return res.status(200).json({
      status: "success",
      message: "User Registered Successfully!",
      data: user,
    });
  } catch (error) {
    return res.status(400).json({
      status: "error",
      message: error.message,
    });
  }
};

// login function
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        status: "error",
        message: "Invalid Credentials!",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({
        status: "error",
        message: "Password Not Match!",
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      {
        expiresIn: "24h",
      }
    );

    // Set the token in an httpOnly cookie
    res.cookie("token", token, {
      httpOnly: true, // Prevents client-side access to the cookie
      secure: process.env.NODE_ENV === "production", // Send only over HTTPS in production
      sameSite: "strict", // Protects against CSRF
      maxAge: 60 * 60 * 1000, // 1 hour expiration
    });

    // Send the user info and token in the response
    return res.status(200).json({
      status: "success",
      message: "Login Successfully!",
      user: user,
      token: token,
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};

// logout function
exports.logout = async (req, res) => {
  // Check if the user is authenticated by verifying the presence of a token or user session
  if (!req.cookies.token) {
    return res.status(404).json({
      status: "error",
      message: "User not found or already logged out!",
    });
  }

  // Clear the authentication cookie
  res.clearCookie("token");

  // Send a success response
  return res.status(200).json({
    status: "success",
    message: "Logout Successfully!",
  });
};
