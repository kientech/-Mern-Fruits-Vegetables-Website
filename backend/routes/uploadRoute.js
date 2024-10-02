const express = require("express");
const { upload, uploadFile } = require("../controllers/uploadController");

const router = express.Router();

// Route upload file
router.post("/upload", upload.any(), uploadFile);

module.exports = router;
