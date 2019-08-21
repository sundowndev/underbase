import { Migration } from '@underbase/core';
import { IConfigFile } from '@underbase/types';
import { logger } from '@underbase/utils';
import * as fs from 'fs';
import * as path from 'path';

/**
 * Initialize migrator constructor
 * @param {IConfigFile} config - Config object
 * @ignore
 * @private
 */
export const initMigrator = async (config: IConfigFile): Promise<Migration> => {
  logger.info('Connecting to MongoDB...');

  const migrator = new Migration();

  if (
    config.supportFile &&
    fs.existsSync(path.resolve(config.supportFile as string))
  ) {
    const support = await import(path.resolve(config.supportFile as string));

    if (typeof support.default === 'function') {
      support.default(
        (event: string, cb: any) => {
          migrator.registerEvent(event, cb);
        },
        { config },
      );
    }
  }

  await migrator.config(config); // Returns a promise

  return migrator;
};
