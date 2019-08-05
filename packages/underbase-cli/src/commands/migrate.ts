import { IMigration } from 'underbase/src/interfaces';
import * as backup from '../common/backup';
import { exit, importFile, initMigrator, logger, timer } from '../common/utils';

export const describe = 'Migrate to a specified version';

export const action = async ({ config, versions, argv }) => {
  const versionsArray = versions.map((v: string) => parseFloat(v)) as number[];

  if (
    argv.migration !== 0 &&
    argv.migration !== 'latest' &&
    versionsArray.indexOf(parseFloat(argv.migration as string)) < 0
  ) {
    logger.error('This version does not exists.');
    return exit();
  }

  versions = versionsArray.map((v: number) => v.toFixed(1)) as string[];

  versions.sort((a: number, b: number) => a - b);

  const migrator = await initMigrator(config);

  for (const i in versions) {
    if (versions.hasOwnProperty(i)) {
      const migrationObj: IMigration = await importFile(
        `${config.migrationsDir}/${versions[i]}`,
      );

      await migrator.add(migrationObj);
    }
  }

  if (config.backup) {
    const currentVersion = await migrator.getVersion();

    await backup.create(config, currentVersion);
  }

  const time = timer();

  await migrator.migrateTo(argv.migration as number);

  logger.log('');
  logger.log('⌛', `Time spent: ${time.spent()} sec`);
};
