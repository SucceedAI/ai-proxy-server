/**
 * @copyright   (c) Pierre-Henry Soria <https://ph7.me>
 * @license     MIT <https://opensource.org/license/mit>
 */

import axios from 'axios';
import type { AxiosError } from 'axios';
import { logger } from './index.ts';

export const axiosError = (error: any | AxiosError, customDescription: string = ''): void => {
  logger.error(`Error ${customDescription}`, axios.isAxiosError(error) ? error.response?.data?.message : error.message);
};
