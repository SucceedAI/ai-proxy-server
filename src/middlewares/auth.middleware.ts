import { Request, Response, NextFunction } from 'express';
//import jwt from "jsonwebtoken";
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
    if (![config.jwtToken, config.browserExtensionSecret].includes(sid)) {
      throw new Error('Invalid token');
    }

    // TODO Use JWT in the future increasing API access security
    // const decoded = jwt.verify(sid, config.jwtToken);
    // req.user = decoded; // Attach user data to the request object
    next();
  } catch (e: unknown) {
    res.status(StatusCodes.BAD_REQUEST).send('Invalid token.');
  }
};
