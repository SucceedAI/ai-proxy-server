/**
 * @copyright   (c) Pierre-Henry Soria <https://ph7.me>
 * @license     MIT <https://opensource.org/license/mit>
 */

import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';

import { config } from '../config';

// Hack: nodemon wants this here
declare global {
  namespace Express {
    export interface Request {
      user?: any;
    }
  }
}

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const errorMessage: string = 'Access denied. Token not found';
  const acceptedTokens = [config.jwtToken, config.browserExtensionSecret].filter(Boolean);

  if (!acceptedTokens.length) {
    return res.status(StatusCodes.SERVICE_UNAVAILABLE).send('Server authentication is not configured.');
  }

  // Retrieve authorization token
  const authHeader: string | undefined = req.header('authorization');
  const tokenPrefix: string = 'Bearer ';

  if (!authHeader?.startsWith(tokenPrefix)) {
    return res.status(StatusCodes.UNAUTHORIZED).send(errorMessage);
  }

  const sid: string = authHeader.substring(tokenPrefix.length);
  if (!sid?.length) {
    return res.status(StatusCodes.UNAUTHORIZED).send(errorMessage);
  }

  try {
    if (!acceptedTokens.includes(sid)) {
      throw new Error('Invalid token');
    }

    // The macOS app uses a shared bearer token so Railway deployments can rotate
    // one secret without forcing end-user credential handling in the client.
    next();
  } catch (e: unknown) {
    return res.status(StatusCodes.UNAUTHORIZED).send('Invalid token.');
  }
};
