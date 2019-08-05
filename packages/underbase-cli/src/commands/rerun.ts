import { IMigration } from 'underbase/src/interfaces';
import * as backup from '../common/backup';
import { importFile, initMigrator, logger, timer } from '../common/utils';

export const describe = 'Rerun the current version';

export const action = async ({ config, versions }) => {
  const versionsArray = versions.map((v: string) => parseFloat(v)) as number[];

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

  const currentVersion = await migrator.getVersion();

  if (config.backup) {
    await backup.create(config, currentVersion);
  }

  const time = timer();

  await migrator.migrateTo(`${currentVersion as number},rerun`);

  logger.log('');
  logger.log('⌛', `Time spent: ${time.spent()} sec`);
};
