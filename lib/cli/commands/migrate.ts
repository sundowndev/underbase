import { IMigration } from '../../interfaces';
import * as backup from '../common/backup';
import { exit, importFile, initMigrator, logger, timer } from '../common/utils';

export default async ({ config, versions, argv }) => {
  const versionsArray = versions.map((v: string) => parseFloat(v)) as number[];

  if (
    argv.migration !== 0 &&
    argv.migration !== 'latest' &&
    versionsArray.indexOf(parseFloat(argv.migration as string)) < 0
  ) {
    logger('error', 'This version does not exists.');
    return exit();
  }

  versions = versionsArray.map((v: number) => v.toFixed(1)) as string[];

  versions.sort((a: number, b: number) => a - b);

  const migrator = await initMigrator(config);

  versions.forEach(async (v: string) => {
    try {
      const migrationObj: IMigration = await importFile(
        `${config.migrationsDir}/${v}`,
      );

      await migrator.add(migrationObj);
    } catch (error) {
      throw new Error(error);
    }
  });

  if (config.backup) {
    const currentVersion = await migrator.getVersion();

    await backup.create(
      config.mongodumpBinary,
      currentVersion,
      config.backupsDir,
    );
  }

  const time = timer();

  try {
    await migrator.migrateTo(
      argv.rerun
        ? `${argv.migration as string},rerun`
        : (argv.migration as string),
    );
  } catch (error) {
    throw new Error(error);
  }

  logger('info', `Time spent: ${time.spent()} sec`);
};
