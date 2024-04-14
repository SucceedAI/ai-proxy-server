import express from 'express';

import { AIController } from './ai.controller';
import { licensingMiddleware } from '../middlewares/licensing.middleware';

const router = express.Router();

router.post('/query', licensingMiddleware, AIController.query);

export { router };
