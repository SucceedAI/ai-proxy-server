import { Request, Response, NextFunction } from "express";
//import jwt from "jsonwebtoken";
import { StatusCodes } from "http-status-codes";

import { config } from "../config";

// Hack: nodemon wants this here
declare global {
    namespace Express {
      export interface Request {
        user?: any;
      }
    }
  }


export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const errorMessage: string = "Access denied. Token not found";

  // Authorization Token
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer")) {
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .send(errorMessage);
  }

  const token = req.headers.authorization?.split(" ")[1];

  if (!token?.length) {
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .send(errorMessage);
  }

  try {
    if (token !== config.jwtToken) {
      throw new Error('Invalid token');
    }

    // TODO Use JWT in the future increasing API access security
    // const decoded = jwt.verify(token, config.jwtToken);
    // req.user = decoded; // Attach user data to the request object
    next();
  } catch (e: unknown) {
    res.status(StatusCodes.BAD_REQUEST).send("Invalid token.");
  }
};
