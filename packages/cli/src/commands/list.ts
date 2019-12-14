import { TCommandAction } from '@underbase/types';
import { logger } from '@underbase/utils';
import * as fs from 'fs-extra';

export const command = 'list';
export const describe = 'Show available migrations versions';
export const action: TCommandAction = async ({ config, versions }) => {
  if (config.migrationsDir && fs.existsSync(config.migrationsDir)) {
    logger.info('Versions list based on folders');

    for (const version of versions) {
      logger.log(`- ${version}`);
    }
  }
};
