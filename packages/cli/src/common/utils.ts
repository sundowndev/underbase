import { Migration } from '@underbase/core';
import { IConfigFile, IMigration } from '@underbase/types';
import { importFile, logger } from '@underbase/utils';
import * as fs from 'fs-extra';
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

  if (config.supportFile && fs.existsSync(path.resolve(config.supportFile))) {
    const support = await import(path.resolve(config.supportFile));

    if (typeof support.default === 'function') {
      support.default(
        (event: string, cb: (...args: any[]) => Promise<any>): void => {
          return migrator.registerEvent(event, cb);
        },
        { config },
      );
    }
  }

  await migrator.config(config); // Returns a promise

  return migrator;
};

export const getMigrations = async (
  config: IConfigFile,
  versions: string[],
): Promise<IMigration[]> => {
  const files = await getMigrationsEntryFiles(config, versions);
  const migrations = [];

  for (const file of files) {
    if (file) {
      const migration: IMigration = await importFile(file);
      migrations.push(migration);
    }
  }

  return migrations;
};

export const getMigrationsEntryFiles = async (
  config: IConfigFile,
  versions: string[],
): Promise<string[]> => {
  const paths: string[] = [];

  for (const version of versions) {
    const indexPath = fs
      .readdirSync(`${config.migrationsDir}/${version}`)
      .filter(f => f.match(/^index.([\w])+$/))
      .shift();

    if (indexPath && config.migrationsDir) {
      paths.push(path.join(config.migrationsDir, version, indexPath));
    }
  }

  return paths;
};
