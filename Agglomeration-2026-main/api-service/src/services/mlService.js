import axios from "axios";
import FormData from "form-data";
import { config } from "../config/index.js";

export class MLService {
  constructor() {
    this.client = axios.create({
      baseURL: config.mlServiceUrl,
      timeout: config.requestTimeout,
    });
  }

  async inferImage(fileBuffer, filename) {
    const formData = new FormData();
    formData.append("file", fileBuffer, {
      filename,
      contentType: "image/jpeg",
    });

    try {
      console.log(`[ML] Sending image to ML service: ${filename}`);
      const start = Date.now();

      // Step 1: Get initial inference
      const response = await this.client.post("/infer", formData, {
        headers: formData.getHeaders(),
      });
      const inferDuration = Date.now() - start;
      console.log(
        `[ML] Received /infer response ${response.status} in ${inferDuration}ms`,
      );

      // Step 2: Call /colorpet and /wtestimate in parallel
      const parallelStart = Date.now();
      const [colorpetResponse, wtestimateResponse] = await Promise.all([
        this.client.post("/colorpet", response.data),
        this.client.post("/wtestimate", response.data),
      ]);
      const parallelDuration = Date.now() - parallelStart;
      console.log(
        `[ML] Received /colorpet and /wtestimate responses in ${parallelDuration}ms`,
      );

      // Step 3: Merge the responses
      const mergedResult = this.mergeResponses(
        colorpetResponse.data,
        wtestimateResponse.data,
      );

      const totalDuration = Date.now() - start;
      console.log(`[ML] Total processing time: ${totalDuration}ms`);

      return mergedResult;
    } catch (error) {
      if (error.response) {
        throw new Error(
          `ML service error: ${error.response.data?.detail || error.response.statusText}`,
        );
      } else if (error.request) {
        throw new Error("ML service unavailable");
      } else {
        throw new Error(`Request failed: ${error.message}`);
      }
    }
  }

  /**
   * Merge colorpet and wtestimate responses
   * colorpet returns: array of detections with color and is_pet
   * wtestimate returns: { num_detections, results: [...with estimated_length_cm, estimated_weight_g] }
   */
  mergeResponses(colorpetData, wtestimateData) {
    // colorpetData is an array of bottle detections
    const colorpetBottles = Array.isArray(colorpetData) ? colorpetData : [];

    // wtestimateData has { num_detections, results: [...] }
    const wtestimateBottles = wtestimateData?.results || [];

    // Merge by matching bbox_xyxy or by index
    const mergedBottles = colorpetBottles.map((bottle, index) => {
      // Try to find matching wtestimate result by bbox
      let wtMatch = wtestimateBottles.find(
        (wt) =>
          wt.bbox_xyxy &&
          bottle.bbox_xyxy &&
          JSON.stringify(wt.bbox_xyxy) === JSON.stringify(bottle.bbox_xyxy),
      );

      // Fallback to index matching if bbox doesn't match
      if (!wtMatch && wtestimateBottles[index]) {
        wtMatch = wtestimateBottles[index];
      }

      return {
        ...bottle,
        estimated_length_cm: wtMatch?.estimated_length_cm || null,
        estimated_weight_g: wtMatch?.estimated_weight_g || null,
      };
    });

    return mergedBottles;
  }
}
