import { IConfigFile, IMigration } from '@underbase/types';
import { exit, importFile, logger, timer } from '@underbase/utils';
import { initMigrator } from '../common/utils';

export const command = 'migrate <migration>';
export const desc = 'Migrate to a specified version';
export const action = async ({
  config,
  versions,
  argv,
}: {
  config: IConfigFile;
  versions: string[];
  argv: any;
}) => {
  const versionsArray = versions.map((v: string) => parseFloat(v)) as number[];

  if (
    argv.migration !== 0 &&
    argv.migration !== 'latest' &&
    versionsArray.indexOf(parseFloat(argv.migration as string)) < 0
  ) {
    logger.error('This version does not exists.');
    return exit();
  }

  versionsArray.sort((a: number, b: number) => a - b);
  versions = versionsArray.map((v: number) => v.toFixed(1)) as string[];

  const migrator = await initMigrator(config);

  for (const i in versions) {
    if (versions.hasOwnProperty(i)) {
      const migration: IMigration = await importFile(
        `${config.migrationsDir}/${versions[i]}/index`,
      );

      await migrator.add(migration);
    }
  }

  const time = timer();

  await migrator.migrateTo(argv.migration as number);

  logger.log('');
  logger.log('✦', `Time spent: ${time.spent()} sec`);
};
