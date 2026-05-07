/**
 * @copyright   (c) Pierre-Henry Soria <https://ph7.me>
 * @license     MIT <https://opensource.org/license/mit>
 */

import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import { LicenseService } from '../user';
import { config } from '../config';

// Hack: nodemon wants this here
declare global {
  namespace Express {
    export interface Request {
      user?: any;
    }
  }
}

export const licensingMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  const errorMessage: string = 'Access denied. License key not valid';

  if (!config.licenseCheckEnabled) {
    return next();
  }

  if (!config.lemonSqueezyApiKey.length) {
    return res.status(StatusCodes.SERVICE_UNAVAILABLE).send('License validation is not configured.');
  }

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
    const isValid = await LicenseService.isUserLicenseKeyValid(licenseIdHeader, licenseKeyHeader);
    if (!isValid) {
      throw new Error(errorMessage);
    }
    next();
  } catch (e: unknown) {
    return res.status(StatusCodes.UNAUTHORIZED).send(errorMessage);
  }
};
