import pino, { Logger, LoggerOptions } from "pino";
import { Response } from "express";

const { NODE_ENV = "development" } = process.env;

const isProduction = NODE_ENV === "production";
const logLevel = isProduction ? "info" : "debug";

const loggerOptions: LoggerOptions = {
  level: logLevel,
  timestamp: pino.stdTimeFunctions.isoTime,
  base: {
    service: "wedding-api",
    environment: NODE_ENV,
  },
  formatters: {
    level: (label) => ({ level: label }),
  },
  serializers: {
    req: (req: { method?: string; url?: string; path?: string; requestId?: string }) => ({
      method: req.method,
      url: req.url,
      path: req.path,
      requestId: req.requestId,
    }),
    res: (res: { statusCode?: number }) => ({
      statusCode: res.statusCode,
    }),
    err: pino.stdSerializers.err,
  },
  ...(isProduction
    ? {}
    : {
        transport: {
          target: "pino-pretty",
          options: {
            colorize: true,
            translateTime: "SYS:standard",
            ignore: "pid,hostname,service,environment",
          },
        },
      }),
};

export const logger: Logger = pino(loggerOptions);

export const loggers = {
  http: logger.child({ module: "http" }),
  db: logger.child({ module: "db" }),
  app: logger.child({ module: "app" }),
  auth: logger.child({ module: "auth" }),
};

// ---------------------------------------------------------------------------
// Wide Event Types (canonical log line / loggingsucks.com pattern)
// ---------------------------------------------------------------------------

export type ErrorCategory = "user" | "system" | "external" | "validation";

interface DbOperationRecord {
  operation: string;
  latency_ms: number;
  success: boolean;
}

export interface WideEvent {
  /** Marker to identify wide events in log streams */
  main: true;
  timestamp: string;
  request_id: string;
  service: string;
  environment: string;

  request: {
    method: string;
    path: string;
    ip?: string;
    user_agent?: string;
  };

  response: {
    status_code: number;
    duration_ms: number;
  };

  guest?: {
    id?: string;
    first_name?: string;
    last_name?: string;
    group_id?: string;
  };

  business?: {
    operation?: string;
    rsvp_status?: string;
    guest_count?: number;
    group_count?: number;
    reminder_type?: string;
    [key: string]: unknown;
  };

  db_operations: DbOperationRecord[];

  error?: {
    type: string;
    message: string;
    code?: string;
    category: ErrorCategory;
    slug: string;
    retriable: boolean;
    stack?: string;
  } | null;
}

// ---------------------------------------------------------------------------
// Wide Event Helpers
// ---------------------------------------------------------------------------

export function initializeWideEvent(
  requestId: string,
  method: string,
  path: string,
  ip?: string,
  userAgent?: string,
): WideEvent {
  return {
    main: true,
    timestamp: new Date().toISOString(),
    request_id: requestId,
    service: "wedding-api",
    environment: NODE_ENV,
    request: { method, path, ip, user_agent: userAgent },
    response: { status_code: 0, duration_ms: 0 },
    db_operations: [],
    error: null,
  };
}

export function enrichWideEvent(
  res: Response,
  data: Partial<Pick<WideEvent, "guest" | "business" | "error">>,
): void {
  const wideEvent = res.locals.wideEvent as WideEvent | undefined;
  if (!wideEvent) return;

  if (data.guest) {
    wideEvent.guest = { ...wideEvent.guest, ...data.guest };
  }
  if (data.business) {
    wideEvent.business = { ...wideEvent.business, ...data.business };
  }
  if (data.error) {
    wideEvent.error = data.error;
  }
}

export function addDbOperation(res: Response, record: DbOperationRecord): void {
  const wideEvent = res.locals.wideEvent as WideEvent | undefined;
  if (!wideEvent) return;
  wideEvent.db_operations.push(record);
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

export function setWideEventError(
  res: Response,
  err: Error & { code?: string },
  slug: string,
  category?: ErrorCategory,
): void {
  const wideEvent = res.locals.wideEvent as WideEvent | undefined;
  if (!wideEvent) return;

  wideEvent.error = {
    type: err.name || "Error",
    message: err.message,
    code: err.code,
    category: category ?? inferErrorCategory(err),
    slug,
    retriable: isRetriableError(err),
    stack: !isProduction ? err.stack : undefined,
  };
}

// ---------------------------------------------------------------------------
// Tail Sampling
// ---------------------------------------------------------------------------

function shouldSkipPath(path: string): boolean {
  return (
    path === "/api/health" ||
    path.startsWith("/static") ||
    path.endsWith(".js") ||
    path.endsWith(".css") ||
    path.endsWith(".map")
  );
}

export function shouldSampleWideEvent(event: WideEvent): boolean {
  if (shouldSkipPath(event.request.path)) return false;

  // Always keep errors
  if (event.response.status_code >= 500) return true;
  if (event.error) return true;

  // Always keep slow requests (>2s)
  if (event.response.duration_ms > 2000) return true;

  // Always keep client errors
  if (event.response.status_code >= 400) return true;

  // Random sample the rest
  const sampleRate = isProduction ? 0.1 : 1.0;
  return Math.random() < sampleRate;
}

export function emitWideEvent(event: WideEvent): void {
  if (!shouldSampleWideEvent(event)) return;

  const level =
    event.error || event.response.status_code >= 500 ? "error" : "info";
  logger[level](event, "request_completed");
}

// ---------------------------------------------------------------------------
// DB Operation Tracking (preserves existing API)
// ---------------------------------------------------------------------------

export async function trackDbOperation<T>(
  operationName: string,
  fn: () => Promise<T>,
  res?: Response,
): Promise<T> {
  const startTime = Date.now();
  let success = true;
  let errorMessage: string | undefined;

  try {
    const result = await fn();
    return result;
  } catch (error) {
    success = false;
    errorMessage = error instanceof Error ? error.message : String(error);
    loggers.db.error({ operation: operationName, error: errorMessage }, "Database operation failed");
    throw error;
  } finally {
    const latencyMs = Date.now() - startTime;

    if (res) {
      addDbOperation(res, { operation: operationName, latency_ms: latencyMs, success });
    }

    if (latencyMs > 100) {
      loggers.db.info(
        { operation: operationName, latency_ms: latencyMs, success },
        "Slow database operation"
      );
    } else {
      loggers.db.debug(
        { operation: operationName, latency_ms: latencyMs, success },
        "Database operation completed"
      );
    }
  }
}

export default logger;
