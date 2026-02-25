import './loadEnv.js';
import * as Sentry from '@sentry/node';

const { SENTRY_DSN, NODE_ENV = 'development', SENTRY_ENVIRONMENT } = process.env;
const APP_VERSION = process.env.APP_VERSION ?? '1.0.0';
const isProduction = NODE_ENV === 'production';

const IGNORED_ERRORS = [
  'ECONNRESET',
  'ECONNREFUSED',
  'ETIMEDOUT',
  'ENOTFOUND',
  'socket hang up',
  'write EPIPE',
  'read ECONNRESET',
  'Too Many Requests',
  'aborted',
];

if (SENTRY_DSN) {
  Sentry.init({
    dsn: SENTRY_DSN,
    environment: SENTRY_ENVIRONMENT ?? NODE_ENV,
    release: `wedding-api@${APP_VERSION}`,
    debug: false,

    enableLogs: true,

    integrations: [
      Sentry.pinoIntegration({
        log: {
          levels: isProduction
            ? ['info', 'warn', 'error', 'fatal']
            : ['debug', 'info', 'warn', 'error', 'fatal'],
        },
        error: {
          levels: ['error', 'fatal'],
          handled: true,
        },
      }),
    ],

    tracesSampleRate: 1.0,
    profileSessionSampleRate: isProduction ? 0.5 : 0,

    sendDefaultPii: false,
    maxBreadcrumbs: 100,
    attachStacktrace: true,
    normalizeDepth: 5,

    ignoreErrors: IGNORED_ERRORS,

    beforeSendLog(log) {
      if (isProduction && log.level === 'debug') {
        return null;
      }

      if (log.attributes) {
        const sensitiveKeys = ['password', 'token', 'secret', 'apiKey', 'api_key'];
        for (const key of sensitiveKeys) {
          if (key in log.attributes) {
            delete log.attributes[key];
          }
        }
      }

      return log;
    },

    beforeSend(event, hint) {
      const error = hint.originalException;

      if (error instanceof Error) {
        if (
          error.message?.includes('aborted') ||
          error.message?.includes('ECONNRESET')
        ) {
          return null;
        }

        const statusCode = (error as Error & { statusCode?: number }).statusCode;
        if (statusCode && statusCode >= 400 && statusCode < 500) {
          if (Math.random() > 0.1) {
            return null;
          }
        }
      }

      return event;
    },

    beforeSendTransaction(event) {
      const transactionName = event.transaction ?? '';

      if (
        transactionName.includes('/health') ||
        transactionName.includes('/favicon') ||
        transactionName.includes('/robots.txt') ||
        transactionName.startsWith('/static')
      ) {
        return null;
      }

      if (
        event.spans?.length === 0 &&
        (event.timestamp ?? 0) - (event.start_timestamp ?? 0) < 0.01
      ) {
        return null;
      }

      return event;
    },

    initialScope: {
      tags: {
        component: 'backend',
        framework: 'express',
      },
    },
  });
}

export { Sentry };
