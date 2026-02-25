import { Sentry } from './instrument';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import posthog from 'posthog-js';
import { PostHogProvider } from 'posthog-js/react';
import { ErrorBoundary } from './components/ErrorBoundary';
import App from './App.tsx';
import './index.css';

const POSTHOG_KEY = import.meta.env.VITE_POSTHOG_KEY as string | undefined;
const POSTHOG_HOST = import.meta.env.VITE_POSTHOG_HOST as string | undefined;
const isProduction = import.meta.env.MODE === 'production';
const isDevelopment = import.meta.env.MODE === 'development';

if (POSTHOG_KEY && POSTHOG_HOST) {
  posthog.init(POSTHOG_KEY, {
    api_host: POSTHOG_HOST,

    person_profiles: 'identified_only',

    capture_pageview: true,
    capture_pageleave: true,

    autocapture: true,

    capture_performance: true,
    capture_heatmaps: isProduction,

    loaded: (ph) => {
      if (isDevelopment) {
        ph.debug();
      }

      const sessionId = ph.get_session_id();
      if (sessionId) {
        Sentry.setTag('posthog_session_id', sessionId);
      }
    },

    respect_dnt: true,
    persistence: 'localStorage+cookie',
    opt_out_capturing_by_default: false,
    disable_session_recording: isDevelopment,
  });
}

createRoot(document.getElementById('root')!, {
  onUncaughtError: Sentry.reactErrorHandler((error, errorInfo) => {
    console.warn('Uncaught error', error, errorInfo.componentStack);
  }),
  onCaughtError: Sentry.reactErrorHandler(),
  onRecoverableError: Sentry.reactErrorHandler(),
}).render(
  <StrictMode>
    <ErrorBoundary>
      {POSTHOG_KEY ? (
        <PostHogProvider client={posthog}>
          <App />
        </PostHogProvider>
      ) : (
        <App />
      )}
    </ErrorBoundary>
  </StrictMode>
);
