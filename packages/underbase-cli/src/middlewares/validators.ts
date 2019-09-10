import { IConfigFile } from '@underbase/types';
import { logger } from '@underbase/utils';
import * as fs from 'fs-extra';

export const checkMigrationDirExists = (config: IConfigFile) => {
  if (!fs.existsSync(config.migrationsDir as fs.PathLike)) {
    logger.warn(
      'Migration directory does not exists. Please run underbase init.',
    );
  }
};
