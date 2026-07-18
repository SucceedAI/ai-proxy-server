/**
 * @copyright   (c) Pierre-Henry Soria <https://ph7.me>
 * @license     MIT <https://opensource.org/license/mit>
 */

import express from 'express';
import type { Express, Request, Response } from 'express';
import compression from 'compression';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';

import { router as mainRoutes } from './main.routes.ts';
import { router as aiRoutes } from './ai/index.ts';
import { authMiddleware } from './middlewares/auth.middleware.ts';
import { config, messages } from './config/index.ts';
import { logger } from './logger/index.ts';

const app: Express = express();

// Set rate limiter - very important to prevent abuse
const rateLimiter = rateLimit({
  windowMs: config.rateLimitWindowMs,
  max: config.rateLimitMax,
});

app.set('trust proxy', 1);
app.use(compression());

// Apply the rate limiting middleware to API calls only
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

app.listen(config.port, () => {
  logger.info(`Server is running on port ${config.port}`);
});
