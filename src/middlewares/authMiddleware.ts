import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
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
  const token = req.headers.authorization?.split(" ")[1]; // Bearer Token

  if (!token) {
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .send("Access denied. No token provided.");
  }

  try {
    const decoded = jwt.verify(token, config.jwtToken);
    
    req.user = decoded; // Attach user data to the request object
    next();
  } catch (ex) {
    res.status(StatusCodes.BAD_REQUEST).send("Invalid token.");
  }
};
