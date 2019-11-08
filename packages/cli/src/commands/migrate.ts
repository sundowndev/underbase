import { IConfigFile } from '@underbase/types';
import { exit, logger, timer } from '@underbase/utils';
import * as fs from 'fs-extra';
import * as path from 'path';
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
}): Promise<void> => {
  if (config.supportFile && fs.existsSync(path.resolve(config.supportFile))) {
    try {
      const support = await import(path.resolve(config.supportFile));

      if (support.beforeMigrating) {
        await support.beforeMigrating({ config });
      }
    } catch (e) {
      logger.log(e);
      return exit();
    }
  }

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
