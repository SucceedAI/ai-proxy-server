import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import { UserService } from 'src/user';

// Hack: nodemon wants this here
declare global {
  namespace Express {
    export interface Request {
      user?: any;
    }
  }
}

export const licensingMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const errorMessage: string = 'Access denied. License key not valid';

  // Retrieve license key from header
  const licenseKeyHeader: string | undefined = req.headers.license;
  if (!licenseKeyHeader?.length) {
    return res.status(StatusCodes.UNAUTHORIZED).send(errorMessage);
  }

  try {
    if (!UserService.isUserLicenseKeyFound(licenseKeyHeader)) {
      throw new Error(errorMessage);
    }
  } catch (e: unknown) {
    res.status(StatusCodes.BAD_REQUEST).send(errorMessage);
  }

  next();
};
