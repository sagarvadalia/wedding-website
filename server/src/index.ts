import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import rsvpRoutes from './routes/rsvp.js';
import adminRoutes from './routes/admin.js';
import { initDb } from './db.js';
import { loggers } from './utils/logger.js';
import { requestIdMiddleware } from './middleware/requestId.js';
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js';

const log = loggers.app;

dotenv.config();

const app = express();
const PORT = process.env.PORT ?? 5001;

// Middleware
app.use(requestIdMiddleware);
app.use(cors({
  origin: process.env.CLIENT_URL ?? 'http://localhost:5173',
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
const path = await import('path');
const fs = await import('fs');
const { fileURLToPath } = await import('url');
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
