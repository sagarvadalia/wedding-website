import { ErrorRequestHandler, Request, Response, NextFunction } from "express";
import { loggers } from "../utils/logger.js";

// Custom error interface for HTTP errors
interface HttpError extends Error {
  statusCode?: number;
  status?: number;
  expose?: boolean;
}

/**
 * Centralized Error Handler Middleware
 *
 * Handles all errors thrown in route handlers and middleware.
 * - Logs errors with structured logging
 * - Returns appropriate HTTP status codes
 * - Hides internal error details in production
 */
export const errorHandler: ErrorRequestHandler = (
  err: HttpError,
  req: Request,
  res: Response,
  _next: NextFunction,
) => {
  // Determine status code
  const statusCode = err.statusCode ?? err.status ?? 500;
  const isServerError = statusCode >= 500;

  // Log errors with structured logger
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

  // Send response - don't expose internal error details in production
  const isDevelopment = process.env.NODE_ENV !== "production";
  res.status(statusCode).json({
    error: err.name ?? "Internal Server Error",
    message:
      isDevelopment || err.expose || !isServerError
        ? err.message
        : "An unexpected error occurred",
    ...(isDevelopment && { stack: err.stack }),
  });
};

/**
 * Not Found Handler
 *
 * Returns 404 for unmatched routes
 */
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
