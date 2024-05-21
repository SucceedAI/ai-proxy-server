import express, { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { config } from './config';
import { StatusCodes } from 'http-status-codes';

const router = express.Router();

router.post('/token-generator', (req: Request, res: Response) => {
  // Authentication logic here...

  const token = jwt.sign(
    {
      /* user data */
    },
    config.jwtToken,
    {
      expiresIn: config.jwtTokenExpiryTime,
    }
  );

  res.status(StatusCodes.OK).json({ token });
});

router.get('/health', (req: Request, res: Response) => {
  res.status(StatusCodes.OK).json({ health: true });
});

router.get('/version', (req: Request, res: Response) => {
  try {
    // Retrieve version from package.json
    const packageJson = require('../package.json');
    const version = packageJson.version;

    res.status(StatusCodes.OK).json({ version });
  } catch (error) {
    console.error('Failed to retrieve version:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'Failed to retrieve version' });
  }
});

export { router };
