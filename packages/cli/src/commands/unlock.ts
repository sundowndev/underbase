import { IConfigFile } from '@underbase/types';
import { logger, timer } from '@underbase/utils';
import { initMigrator } from '../common/utils';

export const command = 'force-unlock';
export const describe = 'Force unlock migrations state';
export const action = async ({ config }: { config: IConfigFile }) => {
  const migrator = await initMigrator(config);

  if (await migrator.isLocked()) {
    const time = timer();

    await migrator.unlock(); // Returns a promise

    logger.info(`Migration state unlocked.`);

    logger.log('✦', `Time spent: ${time.spent()} sec`);
  } else {
    logger.info(`Migration state is already unlocked.`);
  }
};
