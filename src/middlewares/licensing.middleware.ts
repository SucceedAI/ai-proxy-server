import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import { LicenseService } from '../user';

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
  const licenseHeader: string = req.header('license') as string;
  if (!licenseHeader?.length) {
    return res.status(StatusCodes.UNAUTHORIZED).send(errorMessage);
  }

  // License Id and License Key are both receive from License header separated by a colon
  const [licenseIdHeader, licenseKeyHeader] = licenseHeader.split(':');
  if (!licenseIdHeader?.length || !licenseKeyHeader?.length) {
    return res.status(StatusCodes.UNAUTHORIZED).send(errorMessage);
  }

  try {
    if (!LicenseService.isUserLicenseKeyValid(licenseIdHeader, licenseKeyHeader)) {
      throw new Error(errorMessage);
    }
    next();
  } catch (e: unknown) {
    return res.status(StatusCodes.BAD_REQUEST).send(errorMessage);
  }
};
