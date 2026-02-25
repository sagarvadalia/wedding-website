import { PostHog } from "posthog-node";
import { loggers } from "./logger.js";

const log = loggers.app;

const { POSTHOG_KEY, POSTHOG_HOST, NODE_ENV = "development" } = process.env;
const isProduction = NODE_ENV === "production";

let posthogClient: PostHog | null = null;

if (POSTHOG_KEY) {
  posthogClient = new PostHog(POSTHOG_KEY, {
    host: POSTHOG_HOST ?? "https://us.i.posthog.com",
    flushAt: isProduction ? 20 : 1,
    flushInterval: isProduction ? 10000 : 0,
    requestTimeout: 10000,
    disabled: NODE_ENV === "test",
  });
  log.info("PostHog client initialized");
} else {
  log.debug("PostHog not configured (POSTHOG_KEY missing)");
}

export function captureEvent(
  distinctId: string,
  event: string,
  properties?: Record<string, unknown>,
): void {
  posthogClient?.capture({
    distinctId,
    event,
    properties: {
      ...properties,
      timestamp: new Date().toISOString(),
      source: "backend",
    },
  });
}

export function captureAnonymousEvent(
  event: string,
  properties?: Record<string, unknown>,
): void {
  posthogClient?.capture({
    distinctId: "anonymous-server",
    event,
    properties: {
      ...properties,
      timestamp: new Date().toISOString(),
      source: "backend",
    },
  });
}

export async function shutdownPostHog(): Promise<void> {
  if (!posthogClient) return;
  try {
    await posthogClient.shutdown();
    log.info("PostHog shutdown successfully");
  } catch (error) {
    log.error({ err: error }, "Error during PostHog shutdown");
  }
}

export { posthogClient };
