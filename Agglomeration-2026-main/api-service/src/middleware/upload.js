import multer from "multer";
import { config } from "../config/index.js";

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  if (config.allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new Error("Invalid file type. Only JPG, PNG, and WEBP are allowed."),
      false,
    );
  }
};

export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: config.maxFileSize,
  },
});
