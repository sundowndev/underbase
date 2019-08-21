import { IConfigFile, IMigration } from '@underbase/types';
import { importFile, logger } from '@underbase/utils';
import * as fs from 'fs-extra';

export const command = 'validate';
export const describe = 'Validate migration files and configuration.';

export const action = async ({
  config,
  versions,
}: {
  config: IConfigFile;
  versions: string[];
}) => {
  return Promise.all([
    checkMigrationsDir(config.migrationsDir),
    checkMigrationPaths(config, versions),
  ]);
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
  const versionsArray = versions.map((v: string) => parseFloat(v)) as number[];

  versions = versionsArray.map((v: number) => v.toFixed(1)) as string[];
  versionsArray.sort((a: number, b: number) => a - b);

  for (const i in versions) {
    if (versions.hasOwnProperty(i)) {
      // Check if migration file exists
      if (
        !fs.existsSync(`${config.migrationsDir}/${versions[i]}/index.js`) &&
        !fs.existsSync(`${config.migrationsDir}/${versions[i]}/index.ts`)
      ) {
        logger.error(
          'File',
          `${config.migrationsDir}/${versions[i]}/index.js`,
          'does not exists.',
        );
        success = false;
      }

      // Check migration file path
      if (
        !`${config.migrationsDir}/${versions[i]}/index`.match(
          new RegExp(/\/(.*)\/([0-9]*\.[0-9]+|[0-9]+)\/index$/),
        )
      ) {
        logger.warn(
          'File',
          `${config.migrationsDir}/${versions[i]}`,
          'does match pattern the default pattern ([0-9]*.[0-9]+|[0-9]+).',
        );
      }

      const migration: IMigration = await importFile(
        `${config.migrationsDir}/${versions[i]}/index`,
        config.compiler,
      );

      // Check version property
      if (typeof migration.version !== 'number') {
        logger.error(
          'File',
          `${config.migrationsDir}/${versions[i]}`,
          'does not contain a valid version property.',
        );
        success = false;
      }

      // Check describe property
      if (migration.describe && typeof migration.describe !== 'string') {
        logger.error(
          'File',
          `${config.migrationsDir}/${versions[i]}`,
          'does not contain a valid describe property.',
        );
        success = false;
      }

      // Check up property
      if (typeof migration.up !== 'function') {
        logger.error(
          'File',
          `${config.migrationsDir}/${versions[i]}`,
          'does not contain a valid up property.',
        );
        success = false;
      }
      if (
        (migration.up.constructor.name !== 'AsyncFunction' &&
          migration.up.constructor.name !== 'Promise') ||
        (migration.down.constructor.name !== 'AsyncFunction' &&
          migration.down.constructor.name !== 'Promise')
      ) {
        logger.warn(
          'File',
          `${config.migrationsDir}/${versions[i]}`,
          'contain non-async up functions.',
        );
      }

      // Check down property
      if (typeof migration.down !== 'function') {
        logger.error(
          'File',
          `${config.migrationsDir}/${versions[i]}`,
          'does not contain a valid down property.',
        );
        success = false;
      }
    }
  }

  if (success) {
    logger.success('Valided migrations files.');
  }
};
