import { Request, Response, NextFunction } from "express";
import * as Sentry from "@sentry/node";
import {
  initializeWideEvent,
  emitWideEvent,
  type WideEvent,
  type ErrorCategory,
} from "../utils/logger.js";

function shouldSkipLogging(path: string): boolean {
  return (
    path === "/api/health" ||
    path.startsWith("/static") ||
    path.endsWith(".js") ||
    path.endsWith(".css") ||
    path.endsWith(".map") ||
    path === "/favicon.ico"
  );
}

export function wideEventMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  const startTime = Date.now();
  res.locals.requestStartTime = startTime;

  const requestId = req.requestId ?? `req_${Date.now()}`;
  const ip = req.ip ?? req.socket.remoteAddress;
  const userAgent = req.headers["user-agent"];

  const wideEvent = initializeWideEvent(
    requestId,
    req.method,
    req.path,
    ip,
    userAgent,
  );

  res.locals.wideEvent = wideEvent;

  res.on("finish", () => {
    const duration = Date.now() - startTime;
    wideEvent.response.status_code = res.statusCode;
    wideEvent.response.duration_ms = duration;

    if (shouldSkipLogging(req.path)) return;

    emitWideEvent(wideEvent);
  });

  next();
}

function inferErrorCategory(err: Error & { code?: string }): ErrorCategory {
  if (err.name === "ValidationError" || err.name === "ZodError") return "validation";
  if (err.code === "ECONNREFUSED" || err.code === "ETIMEDOUT") return "external";
  return "system";
}

function isRetriableError(err: Error & { code?: string }): boolean {
  const retriableCodes = ["ECONNRESET", "ETIMEDOUT", "ECONNREFUSED", "EPIPE"];
  return err.code !== undefined && retriableCodes.includes(err.code);
}

function generateErrorSlug(err: Error, req: Request): string {
  const routeSegment = req.path
    .replace(/^\/api\//, "")
    .replace(/\/[0-9a-fA-F]{24}/g, ".:id")
    .replace(/\//g, ".");
  return `${routeSegment}.${err.name.toLowerCase()}`;
}

export function wideEventErrorMiddleware(
  err: Error & { statusCode?: number; status?: number; code?: string; slug?: string; category?: ErrorCategory },
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  const wideEvent = res.locals.wideEvent as WideEvent | undefined;

  if (wideEvent && !wideEvent.error) {
    wideEvent.error = {
      type: err.name || "Error",
      message: err.message,
      code: err.code,
      category: err.category ?? inferErrorCategory(err),
      slug: err.slug ?? generateErrorSlug(err, req),
      retriable: isRetriableError(err),
      stack: process.env.NODE_ENV !== "production" ? err.stack : undefined,
    };
  }

  if (wideEvent) {
    Sentry.withScope((scope) => {
      scope.setContext("wide_event", {
        request_id: wideEvent.request_id,
        duration_ms: Date.now() - (res.locals.requestStartTime as number),
        path: wideEvent.request.path,
        method: wideEvent.request.method,
      });

      if (wideEvent.business) {
        scope.setContext("business", wideEvent.business);
      }

      if (wideEvent.guest) {
        scope.setContext("guest", wideEvent.guest);
      }

      if (wideEvent.db_operations.length > 0) {
        scope.setContext("db_operations", {
          count: wideEvent.db_operations.length,
          operations: wideEvent.db_operations,
        });
      }

      if (wideEvent.error?.slug) {
        scope.setTag("error_slug", wideEvent.error.slug);
      }
      if (wideEvent.error?.category) {
        scope.setTag("error_category", wideEvent.error.category);
      }
    });
  }

  next(err);
}
