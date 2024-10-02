const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Cấu hình multer để lưu file
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = "uploads/";
    // Kiểm tra và tạo thư mục nếu chưa tồn tại
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir);
    }
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(
      null,
      `${file.fieldname}-${uniqueSuffix}${path.extname(file.originalname)}`
    );
  },
});

// Khởi tạo multer
const upload = multer({ storage: storage });

// Controller cho việc upload file
const uploadFile = (req, res) => {
  try {
    res.status(200).json({
      status: "success",
      files: req.files,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};

module.exports = {
  upload,
  uploadFile,
};
