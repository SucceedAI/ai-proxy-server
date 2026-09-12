/**
 * @copyright   (c) Pierre-Henry Soria <https://ph7.me>
 * @license     MIT <https://opensource.org/license/mit>
 */

import axios from 'axios';
import type { AxiosError } from 'axios';
import { logger } from './index.ts';

export const axiosError = (error: any | AxiosError, customDescription: string = ''): void => {
  const status = axios.isAxiosError(error) ? error.response?.status : undefined;
  logger.error({ status }, customDescription || 'Upstream request failed');
};
