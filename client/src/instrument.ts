import * as Sentry from "@sentry/react";

const SENTRY_DSN = import.meta.env.VITE_SENTRY_DSN as string | undefined;
const NODE_ENV = import.meta.env.MODE;
const APP_VERSION = (import.meta.env.VITE_APP_VERSION as string | undefined) ?? "1.0.0";
const isProduction = NODE_ENV === "production";

const IGNORED_ERRORS = [
  "Network request failed",
  "Failed to fetch",
  "NetworkError",
  "net::ERR_",
  "Load failed",
  "AbortError",
  "ResizeObserver loop",
  "Script error",
  "Non-Error promise rejection",
  "fb_xd_fragment",
];

if (SENTRY_DSN) {
  Sentry.init({
    dsn: SENTRY_DSN,
    debug: false,
    environment: NODE_ENV,
    release: `wedding-frontend@${APP_VERSION}`,

    enableLogs: true,

    transportOptions: {
      headers: {
        "Content-Type": "application/json",
      },
    },

    integrations: [
      Sentry.browserTracingIntegration({
        enableInp: true,
      }),

      Sentry.consoleLoggingIntegration({
        levels: isProduction ? ["warn", "error"] : ["log", "warn", "error"],
      }),

      Sentry.replayIntegration({
        maskAllText: false,
        blockAllMedia: false,
        maskAllInputs: true,
        networkDetailAllowUrls: [
          window.location.origin,
          /api\./,
          /localhost:5001/,
        ],
        networkCaptureBodies: false,
      }),

      ...(isProduction ? [Sentry.browserProfilingIntegration()] : []),

      Sentry.breadcrumbsIntegration({
        console: true,
        dom: true,
        fetch: true,
        history: true,
        sentry: true,
        xhr: true,
      }),

      Sentry.httpClientIntegration(),
    ],

    beforeSendLog(log) {
      if (isProduction && log.level === "debug") {
        return null;
      }

      if (log.attributes) {
        const sensitiveKeys = ["password", "token", "secret", "apiKey", "api_key"];
        for (const key of sensitiveKeys) {
          if (key in log.attributes) {
            delete log.attributes[key];
          }
        }
      }

      return log;
    },

    tracesSampleRate: 1.0,
    profilesSampleRate: isProduction ? 0.5 : 0,

    replaysSessionSampleRate: 0.1,
    replaysOnErrorSampleRate: 1.0,

    tracePropagationTargets: ["localhost", /^\/api\//],

    ignoreErrors: IGNORED_ERRORS,

    denyUrls: [
      /extensions\//i,
      /^chrome:\/\//i,
      /^chrome-extension:\/\//i,
      /^moz-extension:\/\//i,
      /^safari-extension:\/\//i,
      /graph\.facebook\.com/i,
      /connect\.facebook\.net/i,
      /googletagmanager\.com/i,
      /google-analytics\.com/i,
    ],

    beforeSend(event, hint) {
      const error = hint.originalException;

      if (error instanceof Error) {
        if (
          error.stack?.includes("extension://") ||
          error.stack?.includes("chrome-extension://") ||
          error.stack?.includes("moz-extension://") ||
          error.stack?.includes("safari-extension://")
        ) {
          return null;
        }

        if (error.name === "AbortError" || error.message?.includes("aborted")) {
          return null;
        }
      }

      if (event.exception?.values?.[0]) {
        event.tags = {
          ...event.tags,
          error_type: event.exception.values[0].type || "unknown",
        };
      }

      return event;
    },

    beforeSendTransaction(event) {
      if (
        event.spans?.length === 0 &&
        (event.timestamp ?? 0) - (event.start_timestamp ?? 0) < 0.01
      ) {
        return null;
      }

      const transactionName = event.transaction || "";
      if (
        transactionName.includes("/health") ||
        transactionName.includes("/static/") ||
        transactionName.endsWith(".js") ||
        transactionName.endsWith(".css")
      ) {
        return null;
      }

      return event;
    },

    initialScope: {
      tags: {
        component: "frontend",
        framework: "react",
        bundler: "vite",
      },
    },

    maxBreadcrumbs: 100,
    attachStacktrace: true,
    sendDefaultPii: false,
    normalizeDepth: 5,

    transport: Sentry.makeBrowserOfflineTransport(Sentry.makeFetchTransport),
  });
}

export { Sentry };
