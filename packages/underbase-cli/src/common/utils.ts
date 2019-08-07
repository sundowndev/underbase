import { Migration, migrator } from '@underbase/core';
import { IConfigFile } from '@underbase/types';
import { logger } from '@underbase/utils';

/**
 * Initialize migrator constructor
 * @param {IConfigFile} config - Config object
 * @ignore
 * @private
 */
export const initMigrator = async (config: IConfigFile): Promise<Migration> => {
  logger.info('Connecting to MongoDB...');

  await migrator.config(config); // Returns a promise

  return migrator;
};
