import { MLService } from "../services/mlService.js";
import { AnalyticsService } from "../services/analyticsService.js";

const mlService = new MLService();
const analyticsService = new AnalyticsService();

export class UploadController {
  async uploadSingle(req, res, next) {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
      }

      console.log(
        `[UPLOAD] Single upload received: ${req.file.originalname} size=${req.file.size} bytes`,
      );
      const mlResult = await mlService.inferImage(
        req.file.buffer,
        req.file.originalname,
      );

      console.log(
        `[UPLOAD] ML result for ${req.file.originalname}: bottles=${Array.isArray(mlResult) ? mlResult.length : 0}`,
      );
      // const colorpet = await this.post("/colorpet",mlResult)
      const analytics = analyticsService.aggregateSingle(mlResult);

      res.json({
        success: true,
        result: mlResult,
        analytics,
      });
    } catch (error) {
      next(error);
    }
  }

  async uploadBatch(req, res, next) {
    try {
      if (!req.files || req.files.length === 0) {
        return res.status(400).json({ error: "No files uploaded" });
      }
      console.log(`[UPLOAD] Batch upload received: ${req.files.length} files`);
      req.files.forEach((f) =>
        console.log(`[UPLOAD] - ${f.originalname} size=${f.size}`),
      );

      const promises = req.files.map((file) =>
        mlService.inferImage(file.buffer, file.originalname),
      );

      const mlResults = await Promise.all(promises);
      console.log(`[UPLOAD] Batch ML results: processed=${mlResults.length}`);
      const analytics = analyticsService.aggregateBatch(mlResults);

      res.json({
        success: true,
        results: mlResults,
        analytics,
      });
    } catch (error) {
      next(error);
    }
  }
}
