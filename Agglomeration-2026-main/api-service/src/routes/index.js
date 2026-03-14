import express from "express";
import { upload } from "../middleware/upload.js";
import { UploadController } from "../controllers/uploadController.js";

const router = express.Router();
const uploadController = new UploadController();

router.post("/upload", upload.single("image"), (req, res, next) => {
  uploadController.uploadSingle(req, res, next);
});

router.post("/batch", upload.array("images", 20), (req, res, next) => {
  uploadController.uploadBatch(req, res, next);
});

router.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

export default router;
