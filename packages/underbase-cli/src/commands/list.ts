import * as fs from 'fs-extra';
import { logger } from '../common/utils';

export const describe = 'Show available migrations versions';

export const action = async ({ config, versions }) => {
  if (fs.existsSync(config.migrationsDir)) {
    logger.info('Versions list based on folders');

    versions.forEach((v: string) => logger.log(`- ${v}`));
  }
};
