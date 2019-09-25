import { IConfigFile } from '@underbase/types';
import { exit, logger, timer } from '@underbase/utils';
import { getMigrations, initMigrator } from '../common/utils';

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
  if (
    argv.migration !== 0 &&
    argv.migration !== 'latest' &&
    versions.indexOf(parseFloat(argv.migration).toFixed(1) as string) < 0
  ) {
    logger.error('This version does not exists.');
    return exit();
  }

  const migrator = await initMigrator(config);
  const migrations = await getMigrations(config, versions);

  for (const migration of migrations) {
    await migrator.add(migration);
  }

  const time = timer();

  await migrator.migrateTo(argv.migration as number);

  logger.log('');
  logger.log('✦', `Time spent: ${time.spent()} sec`);
};
