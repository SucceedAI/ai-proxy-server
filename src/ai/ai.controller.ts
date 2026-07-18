/**
 * @copyright   (c) Pierre-Henry Soria <https://ph7.me>
 * @license     MIT <https://opensource.org/license/mit>
 */

import type { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import type { AIQueryRequest, BodyResponse } from './request.type.ts';
import type { AIProvidable } from './api-providers/index.ts';
import { pickAIProvider } from './ai.service.ts';
import { logger } from '../logger/index.ts';

export const query = async (req: Request, res: Response): Promise<any> => {
  const { query, systemInfo }: AIQueryRequest = req.body;
  const trimmedQuery = query?.trim();

  if (!trimmedQuery?.length) {
    return res.status(StatusCodes.BAD_REQUEST).send('Missing query in the payload');
  }

  if (trimmedQuery.length > 12_000) {
    return res.status(StatusCodes.REQUEST_TOO_LONG).send('Query is too large');
  }

  try {
    const aiProvider: AIProvidable = pickAIProvider();
    logger.info(
      { systemInfo, provider: aiProvider.getProviderName(), model: aiProvider.getModel() },
      'AI query request'
    );

    const queryResult: string = await aiProvider.query(trimmedQuery);
    const model = aiProvider.getModel();
    const provider = aiProvider.getProviderName();

    const body: BodyResponse = { content: queryResult, model, provider };
    logger.info({ provider, model }, 'AI query completed');

    res.status(StatusCodes.OK).json(body);
  } catch (error) {
    logger.error('Error:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Error processing request' });
  }
};
