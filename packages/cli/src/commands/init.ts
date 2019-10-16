import { ICommandActionOptions } from '@underbase/types';
import { logger } from '@underbase/utils';
import * as fs from 'fs-extra';

export const command = 'init';
export const describe = 'Initiate migration environment';
export const action = async ({ config }: ICommandActionOptions) => {
  if (config.migrationsDir && !fs.existsSync(config.migrationsDir)) {
    await fs.mkdirpSync(config.migrationsDir);
    logger.info('Created migration directory.');
  } else {
    logger.info('Migration directory already exists.');
  }
};
