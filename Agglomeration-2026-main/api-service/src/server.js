import express from "express";
import { config } from "./config/index.js";
import routes from "./routes/index.js";
import { errorHandler } from "./middleware/errorHandler.js";
import { requestLogger } from "./middleware/logger.js";
import cors from "cors";

const app = express();

app.use(express.json());
app.use(cors());
app.use(requestLogger);
app.use("/api", routes);
app.use(errorHandler);

app.listen(config.port, () => {
  console.log(`API service running on port ${config.port}`);
  console.log(`ML service URL: ${config.mlServiceUrl}`);
});
