import { IConfigFile } from '@underbase/types';
import { logger, timer } from '@underbase/utils';
import { getMigrations, initMigrator } from '../common/utils';

export const command = 'rerun';
export const describe = 'Rerun the current version';
export const action = async ({
  config,
  versions,
}: {
  config: IConfigFile;
  versions: string[];
}) => {
  const migrator = await initMigrator(config);
  const migrations = await getMigrations(config, versions);

  for (const migration of migrations) {
    await migrator.add(migration);
  }

  const currentVersion = await migrator.getVersion();

  const time = timer();

  await migrator.migrateTo(`${currentVersion as number},rerun`);

  logger.log('');
  logger.log('✦', `Time spent: ${time.spent()} sec`);
};
