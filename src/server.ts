import express, { Express, Request, Response } from 'express';
import compression from 'compression';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';

import { router as mainRoutes } from './main.routes';
import { router as aiRoutes } from './ai';
import { authMiddleware } from './middlewares/auth.middleware';
import { config, messages } from './config';
import { logger } from './logger';

const app: Express = express();

// Set rate limiter - very important to prevent abuse
const rateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
});

app.use(compression());

// Apply the rate limiting middleware to API calls only
// Further info about rate limiting https://en.wikipedia.org/wiki/Rate_limiting
app.use(rateLimiter);

// Parse incoming JSON requests and add it in `req.body`
app.use(express.json());

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
