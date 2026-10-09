import express from 'express';
import cors from 'cors';
import { existsSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import apiRouter from './routes/index.js';

const here = dirname(fileURLToPath(import.meta.url));

/**
 * Express ilovasini yaratadi:
 *  1) /api/* — REST API
 *  2) dist/ — yig'ilgan frontend (SPA). Shu tarzda bitta xizmat
 *     ham API, ham saytni beradi (Railway uchun qulay).
 */
export function createApp() {
  const app = express();

  app.use(cors({ origin: process.env.CORS_ORIGIN || '*' }));
  app.use(express.json({ limit: '2mb' }));

  app.use('/api', apiRouter);

  const distDir = resolve(here, '../dist');
  if (existsSync(distDir)) {
    app.use(express.static(distDir));
    app.get('*', (req, res, next) => {
      if (req.path.startsWith('/api')) return next();
      res.sendFile(join(distDir, 'index.html'));
    });
  }

  app.use((_req, res) => {
    res.status(404).json({ error: 'Not found' });
  });

  // eslint-disable-next-line no-unused-vars
  app.use((err, _req, res, _next) => {
    console.error('[server] kutilmagan xato:', err);
    res.status(500).json({ error: 'Server error' });
  });

  return app;
}
