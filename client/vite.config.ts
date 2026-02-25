import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { sentryVitePlugin } from '@sentry/vite-plugin'
import path from 'path'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const appVersion = env.VITE_APP_VERSION || '1.0.0'

  return {
    plugins: [
      react(),
      tailwindcss(),
      sentryVitePlugin({
        org: env.SENTRY_ORG,
        project: env.SENTRY_PROJECT,
        authToken: env.SENTRY_AUTH_TOKEN,
        release: {
          name: `wedding-frontend@${appVersion}`,
          setCommits: {
            auto: true,
            ignoreMissing: true,
            ignoreEmpty: true,
          },
        },
        sourcemaps: {
          filesToDeleteAfterUpload:
            mode === 'production' ? ['./dist/**/*.map'] : [],
        },
        errorHandler: (err) => {
          console.warn('Sentry sourcemap upload failed:', err.message)
        },
      }),
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    build: {
      sourcemap: 'hidden',
    },
    server: {
      proxy: {
        '/api': {
          target: 'http://localhost:5001',
          changeOrigin: true,
        },
      },
    },
  }
})
