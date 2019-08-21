import { IConfigFile, IMigration } from '@underbase/types';
import { importFile, logger, timer } from '@underbase/utils';
import { initMigrator } from '../common/utils';

export const command = 'rerun';
export const describe = 'Rerun the current version';

export const action = async ({
  config,
  versions,
}: {
  config: IConfigFile;
  versions: string[];
}) => {
  const versionsArray = versions.map((v: string) => parseFloat(v)) as number[];

  versionsArray.sort((a: number, b: number) => a - b);
  versions = versionsArray.map((v: number) => v.toFixed(1)) as string[];

  const migrator = await initMigrator(config);

  for (const i in versions) {
    if (versions.hasOwnProperty(i)) {
      const migrationObj: IMigration = await importFile(
        `${config.migrationsDir}/${versions[i]}`,
      );

      await migrator.add(migrationObj);
    }
  }

  const currentVersion = await migrator.getVersion();

  const time = timer();

  await migrator.migrateTo(`${currentVersion as number},rerun`);

  logger.log('');
  logger.log('⌛', `Time spent: ${time.spent()} sec`);
};
