import express, { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { config } from './config';
import { StatusCodes } from 'http-status-codes';

const router = express.Router();

router.post('/token-generator', (req, res) => {
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

router.get('/health', async (req: Request, res: Response) => {
  res.status(StatusCodes.OK).json({ health: true });
});

router.get('/version', async (req: Request, res: Response) => {
  // get version from package.json

  res.status(StatusCodes.OK).json({ version: 1.0 });
});

export { router };
