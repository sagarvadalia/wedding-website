import { Sentry } from "../instrument";

type LogLevel = "trace" | "debug" | "info" | "warn" | "error" | "fatal";
type LogContext = Record<string, unknown>;

const isProduction = import.meta.env.MODE === "production";

function logToSentry(level: LogLevel, message: string, context?: LogContext): void {
  try {
    const attrs = context ? { ...context } : {};
    switch (level) {
      case "trace":
        Sentry.logger.trace(message, attrs);
        break;
      case "debug":
        Sentry.logger.debug(message, attrs);
        break;
      case "info":
        Sentry.logger.info(message, attrs);
        break;
      case "warn":
        Sentry.logger.warn(message, attrs);
        break;
      case "error":
        Sentry.logger.error(message, attrs);
        break;
      case "fatal":
        Sentry.logger.fatal(message, attrs);
        break;
    }
  } catch {
    // Sentry logger not available
  }
}

function log(level: LogLevel, message: string, context?: LogContext): void {
  switch (level) {
    case "trace":
    case "debug":
      if (!isProduction) {
        console.debug(message, context ?? "");
      }
      break;
    case "info":
      console.info(message, context ?? "");
      break;
    case "warn":
      console.warn(message, context ?? "");
      break;
    case "error":
    case "fatal":
      console.error(message, context ?? "");
      break;
  }

  logToSentry(level, message, context);
}

export const logger = {
  trace: (message: string, context?: LogContext) => log("trace", message, context),
  debug: (message: string, context?: LogContext) => log("debug", message, context),
  info: (message: string, context?: LogContext) => log("info", message, context),
  warn: (message: string, context?: LogContext) => log("warn", message, context),
  error: (message: string, context?: LogContext) => {
    log("error", message, context);
    if (context?.error instanceof Error) {
      Sentry.captureException(context.error, { extra: context });
    }
  },
  fatal: (message: string, context?: LogContext) => {
    log("fatal", message, context);
    const error = context?.error instanceof Error ? context.error : new Error(message);
    Sentry.captureException(error, { level: "fatal", extra: context });
  },
};
