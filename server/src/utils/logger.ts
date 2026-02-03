/**
 * Structured Logging Utility
 *
 * Pino-based logger with module namespaces for the wedding website backend.
 * Follows patterns from AirVia project.
 */

import pino, { Logger, LoggerOptions } from "pino";

const { NODE_ENV = "development" } = process.env;

const isProduction = NODE_ENV === "production";
const logLevel = isProduction ? "info" : "debug";

// Base logger configuration
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
  // Pretty print in development
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

// Create the main logger instance
export const logger: Logger = pino(loggerOptions);

// Pre-configured child loggers for different modules
export const loggers = {
  /** Logger for HTTP request handling */
  http: logger.child({ module: "http" }),
  /** Logger for database operations */
  db: logger.child({ module: "db" }),
  /** Logger for application-level logs */
  app: logger.child({ module: "app" }),
  /** Logger for authentication */
  auth: logger.child({ module: "auth" }),
};

/**
 * Track a database operation with automatic latency measurement
 *
 * Logs all operations and highlights slow queries (>100ms).
 *
 * @param operationName - Descriptive name of the operation (e.g., "Guest.findById")
 * @param fn - Async function that performs the database operation
 *
 * @example
 * const guest = await trackDbOperation("Guest.findById", async () => {
 *   return Guest.findById(id);
 * });
 */
export async function trackDbOperation<T>(
  operationName: string,
  fn: () => Promise<T>,
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

    // Log at debug level for fast queries, info for slow queries
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
