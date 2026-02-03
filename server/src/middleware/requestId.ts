import { Request, Response, NextFunction } from "express";
import { randomUUID } from "crypto";

/**
 * Express type extension for requestId
 */
declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      requestId: string;
    }
  }
}

/**
 * Request ID Middleware
 *
 * Generates a unique request ID for each incoming request.
 * - Uses X-Request-ID header if provided by client/load balancer
 * - Generates a new UUID if not provided
 * - Stores in req.requestId and res.locals.requestId for access throughout request lifecycle
 * - Sets X-Request-ID response header for client correlation
 */
export function requestIdMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  // Use existing request ID from header or generate new one
  const requestId =
    (req.headers["x-request-id"] as string | undefined) ?? `req_${randomUUID()}`;

  // Store request ID in multiple places for easy access
  req.requestId = requestId;
  res.locals.requestId = requestId;

  // Set response header for client-side correlation
  res.setHeader("X-Request-ID", requestId);

  next();
}
