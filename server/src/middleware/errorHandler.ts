import { ErrorRequestHandler, Request, Response, NextFunction } from "express";
import { loggers, enrichWideEvent } from "../utils/logger.js";
import { captureAnonymousEvent } from "../utils/posthog.js";

interface HttpError extends Error {
  statusCode?: number;
  status?: number;
  expose?: boolean;
}

interface SentryResponse extends Response {
  sentry?: string;
}

export const errorHandler: ErrorRequestHandler = (
  err: HttpError,
  req: Request,
  res: SentryResponse,
  _next: NextFunction,
) => {
  const statusCode = err.statusCode ?? err.status ?? 500;
  const isServerError = statusCode >= 500;

  if (isServerError) {
    loggers.http.error(
      { err, path: req.path, method: req.method, statusCode, requestId: req.requestId },
      "Server error occurred",
    );
  } else {
    loggers.http.warn(
      { errorMessage: err.message, path: req.path, method: req.method, statusCode, requestId: req.requestId },
      "Client error occurred",
    );
  }

  enrichWideEvent(res, {
    error: {
      type: err.name ?? "Error",
      message: err.message,
      category: isServerError ? "system" : "validation",
      slug: `error.${req.path.replace(/^\/api\//, "").replace(/\//g, ".")}`,
      retriable: false,
    },
  });

  captureAnonymousEvent("api_error", {
    path: req.path,
    method: req.method,
    status_code: statusCode,
    error_name: err.name,
    error_message: err.message,
    is_server_error: isServerError,
    request_id: req.requestId,
  });

  const sentryEventId = res.sentry;
  const isDevelopment = process.env.NODE_ENV !== "production";

  res.status(statusCode).json({
    error: err.name ?? "Internal Server Error",
    message:
      isDevelopment || err.expose || !isServerError
        ? err.message
        : "An unexpected error occurred",
    ...(sentryEventId && { eventId: sentryEventId }),
    ...(isDevelopment && { stack: err.stack }),
  });
};

export const notFoundHandler = (
  req: Request,
  res: Response,
  _next: NextFunction,
) => {
  res.status(404).json({
    error: "Not Found",
    message: `Route ${req.method} ${req.path} not found`,
  });
};
