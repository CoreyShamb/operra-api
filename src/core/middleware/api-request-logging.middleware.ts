import { NextFunction, Request, Response } from "express";
import { createApiRequestLog } from "../../modules/api-keys/api-request-log.service";

export function apiRequestLoggingMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  console.log("[apiRequestLogging] start");

  res.on("finish", async () => {
    try {
      console.log(
        "[apiRequestLogging] finish",
        req.method,
        req.originalUrl,
        res.statusCode
      );

      if (!req.organization || !req.apiKey) {
        console.log("[apiRequestLogging] skipped: missing organization or apiKey");
        return;
      }

      await createApiRequestLog({
        organizationId: req.organization.id,
        apiKeyId: req.apiKey.id,
        method: req.method,
        path: req.originalUrl,
        statusCode: res.statusCode,
      });

      console.log("[apiRequestLogging] log created");
    } catch (error) {
      console.error("[apiRequestLogging] failed to log API request:", error);
    }
  });

  res.on("close", () => {
    console.log(
      "[apiRequestLogging] close",
      req.method,
      req.originalUrl,
      res.statusCode
    );
  });

  return next();
}