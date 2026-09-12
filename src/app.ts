/**
 * @copyright   (c) Pierre-Henry Soria <https://ph7.me>
 * @license     MIT <https://opensource.org/license/mit>
 */

import express from 'express';
import type { Express, Request, Response, NextFunction } from 'express';
import compression from 'compression';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';

import { router as mainRoutes } from './main.routes.ts';
import { router as aiRoutes } from './ai/index.ts';
import { authMiddleware } from './middlewares/auth.middleware.ts';
import { config, messages } from './config/index.ts';

export const createApp = (): Express => {
  const app: Express = express();

  // Set rate limiter - very important to prevent abuse
  const rateLimiter = rateLimit({
    windowMs: config.rateLimitWindowMs,
    max: config.rateLimitMax,
  });

  app.set('trust proxy', config.trustProxyHops);
  app.use(compression());

  // Apply the rate limiting middleware to every route
  // Further info about rate limiting https://en.wikipedia.org/wiki/Rate_limiting
  app.use(rateLimiter);

  // Parse incoming JSON requests and add it in `req.body`.
  app.use(express.json({ limit: config.requestBodyLimit }));

  app.use(helmet());
  app.use(cors());

  app.get('/', (req: Request, res: Response) => {
    res.send(messages.downloadApp);
  });

  app.use('/v1', mainRoutes);
  app.use('/v1/ai', authMiddleware, aiRoutes);

  app.use((error: { status?: number }, _req: Request, res: Response, _next: NextFunction) => {
    const status = error.status === 413 ? 413 : error.status === 400 ? 400 : 500;
    res.status(status).json({
      message:
        status === 413 ? 'Request body is too large' : status === 400 ? 'Invalid JSON payload' : 'Request failed',
    });
  });
  return app;
};
