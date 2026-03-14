export const requestLogger = (req, res, next) => {
  const start = Date.now();
  const remote = req.ip || req.connection?.remoteAddress || "-";
  console.log(`[REQ] ${req.method} ${req.originalUrl} from ${remote}`);

  res.on("finish", () => {
    const duration = Date.now() - start;
    console.log(
      `[RES] ${req.method} ${req.originalUrl} -> ${res.statusCode} ${duration}ms`,
    );
  });

  next();
};
