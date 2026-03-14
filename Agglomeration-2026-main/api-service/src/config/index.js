import dotenv from "dotenv";

dotenv.config();

export const config = {
  port: process.env.PORT || 3000,
  // Use ML_SERVICE_URL env var or default to localhost for local dev
  // For external service: http://10.154.252.108:8000
  mlServiceUrl: process.env.ML_SERVICE_URL || "http://10.154.252.108:8000",
  maxFileSize: parseInt(process.env.MAX_FILE_SIZE || "10485760", 10),
  requestTimeout: parseInt(process.env.REQUEST_TIMEOUT || "60000", 10),
  allowedMimeTypes: ["image/jpeg", "image/png", "image/webp"],
  allowedExtensions: [".jpg", ".jpeg", ".png", ".webp"],
};
