const multer = require("multer");

// File type validation
const fileFilter = (req, file, cb) => {
  const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    const error = new Error("Only JPEG/PNG images allowed");
    error.code = "LIMIT_FILE_TYPE";
    cb(error, false);
  }
};

// Configure Multer with memory storage, file size limit, and file filter
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: fileFilter,
});

// Middleware to handle Multer errors gracefully
const uploadHandler = (req, res, next) => {
  upload.single("file")(req, res, (err) => {
    if (err) {
      if (err.code === "LIMIT_FILE_SIZE") {
        return res
          .status(400)
          .json({ success: false, error: "File size exceeds 5MB limit" });
      } else if (err.code === "LIMIT_FILE_TYPE") {
        return res
          .status(400)
          .json({ success: false, error: "Only JPEG/PNG images allowed" });
      }
      return res.status(400).json({ success: false, error: err.message });
    }
    next();
  });
};

module.exports = { upload, uploadHandler };
