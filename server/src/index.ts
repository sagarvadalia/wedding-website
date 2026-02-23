import './loadEnv.js';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import express from 'express';
import cors from 'cors';
import rsvpRoutes from './routes/rsvp.js';
import adminRoutes from './routes/admin.js';
import { initDb } from './db.js';
import { loggers } from './utils/logger.js';
import { requestIdMiddleware } from './middleware/requestId.js';
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js';

const log = loggers.app;

/** Build allowed CORS origins: CLIENT_URL plus www/non-www and http/https variants. */
function getAllowedOrigins(): string[] {
  const url = process.env.CLIENT_URL ?? 'http://localhost:5173';
  const base = url.replace(/\/$/, '');
  const origins = new Set<string>([base]);
  try {
    const parsed = new URL(base);
    const host = parsed.hostname;
    const hosts: string[] = [host];
    if (host.startsWith('www.')) hosts.push(host.slice(4));
    else if (!host.includes('localhost') && !host.startsWith('127.')) hosts.push(`www.${host}`);
    const schemes: [string, string] = ['http:', 'https:'];
    for (const scheme of schemes) {
      for (const h of hosts) {
        origins.add(`${scheme}//${h}`);
      }
    }
  } catch {
    // invalid URL, use base only
  }
  return [...origins];
}

const app = express();
const PORT = process.env.PORT ?? 5001;

// Middleware
app.use(requestIdMiddleware);
app.use(cors({
  origin: getAllowedOrigins(),
  credentials: true
}));
app.use(express.json());

// Routes
app.use('/api/rsvp', rsvpRoutes);
app.use('/api/admin', adminRoutes);

// Health check
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', message: 'Sagar & Grace Wedding API' });
});

// Serve client SPA from server/public when present (populated by deploy build)
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const publicDir = path.join(__dirname, '..', 'public');
if (fs.existsSync(publicDir)) {
  app.use(express.static(publicDir));
  app.get('*', (_req, res) => {
    res.sendFile(path.join(publicDir, 'index.html'));
  });
}

// Error handling (must be after routes)
app.use(notFoundHandler);
app.use(errorHandler);

// Start server
const startServer = async () => {
  try {
    await initDb();
    app.listen(PORT, () => {
      log.info({ port: PORT }, 'Server started');
    });
  } catch (error) {
    log.warn({ err: error }, 'Failed to connect to MongoDB, starting server anyway');
    // Start server anyway for development
    app.listen(PORT, () => {
      log.info({ port: PORT }, 'Server started (without MongoDB)');
    });
  }
};

startServer().catch((err) => {
  log.error({ err }, 'Failed to start server');
  process.exit(1);
});

export default app;
