const express = require("express");
const router = express.Router();
const multer = require("multer");

const {
  processPrompt,
} = require("../controllers/AIresponseController");

// File upload configuration using multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads"); // Set the destination folder for file uploads
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname); // Rename the file with a timestamp and original name
  },
});

const upload = multer({ storage: storage });

// POST request to process the initial prompt and handle file upload
router.post("/processPrompt", upload.single("file"), processPrompt);

module.exports = router;
