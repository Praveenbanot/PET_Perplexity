import multer from "multer";

export const errorHandler = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === "LIMIT_FILE_SIZE") {
      return res.status(413).json({ error: "File too large" });
    }
    return res.status(400).json({ error: err.message });
  }

  if (err && err.message && err.message.includes("Invalid file type")) {
    return res.status(400).json({ error: err.message });
  }

  console.error("Error:", err);
  const status = err.status || 500;
  const message = err.message || "Internal server error";
  // Respond with both `error` and `message` to be friendly to different clients
  res.status(status).json({
    error: message,
    message,
  });
};
