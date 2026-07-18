/**
 * @copyright   (c) Pierre-Henry Soria <https://ph7.me>
 * @license     MIT <https://opensource.org/license/mit>
 */

import express from 'express';

import { query } from './ai.controller.ts';
import { licensingMiddleware } from '../middlewares/licensing.middleware.ts';

const router = express.Router();

router.post('/query', licensingMiddleware, query);

export { router };
