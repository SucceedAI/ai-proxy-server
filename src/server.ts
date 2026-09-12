/**
 * @copyright   (c) Pierre-Henry Soria <https://ph7.me>
 * @license     MIT <https://opensource.org/license/mit>
 */

import { createApp } from './app.ts';
import { config } from './config/index.ts';
import { logger } from './logger/index.ts';

createApp().listen(config.port, () => {
  logger.info(`Server is running on port ${config.port}`);
});
