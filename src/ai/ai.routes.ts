/**
 * @copyright   (c) Pierre-Henry Soria <https://ph7.me>
 * @license     MIT <https://opensource.org/license/mit>
 */

import express from 'express';

import { AIController } from './ai.controller';
import { licensingMiddleware } from '../middlewares/licensing.middleware';

const router = express.Router();

router.post('/query', licensingMiddleware, AIController.query);

export { router };
