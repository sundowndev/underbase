import { IConfigFile, IMigration, TCommandAction } from '@underbase/types';
import { importFile, logger } from '@underbase/utils';
import * as fs from 'fs-extra';
import { getMigrationsEntryFiles } from '../common/utils';

export const command = 'validate';
export const describe = 'Validate migration files and configuration.';
export const action: TCommandAction = async ({ config, versions }) => {
  await Promise.all([
    checkMigrationsDir(config.migrationsDir),
    checkMigrationPaths(config, versions),
  ]);

  return;
};

const checkMigrationsDir = (migrationsDir: string | undefined) => {
  if (migrationsDir && !fs.existsSync(migrationsDir)) {
    logger.warn('Migrations directory does not exists.');
  } else {
    logger.success('Migrations directory exists.');
  }
};

const checkMigrationPaths = async (config: IConfigFile, versions: string[]) => {
  let success = true;
  const migrations = await getMigrationsEntryFiles(config, versions);

  for (const path of migrations) {
    // Check if migration file exists
    if (!fs.existsSync(path)) {
      logger.error('File', path, 'does not exists.');
      success = false;
    }

    // Check migration file path
    if (
      !path.match(
        new RegExp(/\/(.*)\/([0-9]*\.[0-9]+|[0-9]+)\/index.([\w]){1,}$/),
      )
    ) {
      logger.warn(
        'File',
        path,
        'does match pattern the default pattern: //(.*)/([0-9]*.[0-9]+|[0-9]+)/index.([w]){1,}$/',
      );
    }

    const migration: IMigration = await importFile(path);

    // Check version property
    if (typeof migration.version !== 'number') {
      logger.error('File', path, 'does not contain a valid version property.');
      success = false;
    }

    // Check describe property
    if (migration.describe && typeof migration.describe !== 'string') {
      logger.error('File', path, 'does not contain a valid describe property.');
      success = false;
    }

    // Check up property
    if (typeof migration.up !== 'function') {
      logger.error('File', path, 'does not contain a valid up property.');
      success = false;
    }
    if (
      (migration.up.constructor.name !== 'AsyncFunction' &&
        migration.up.constructor.name !== 'Promise') ||
      (migration.down.constructor.name !== 'AsyncFunction' &&
        migration.down.constructor.name !== 'Promise')
    ) {
      logger.warn('File', path, 'contain non-async up functions.');
    }

    // Check down property
    if (typeof migration.down !== 'function') {
      logger.error('File', path, 'does not contain a valid down property.');
      success = false;
    }
  }

  if (success) {
    logger.success('Validated migrations files.');
  }
};
