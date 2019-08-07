import { logger, timer } from '@underbase/utils';
import { initMigrator } from '../common/utils';

export const describe = 'Unlock migrations state';

export const action = async ({ config }: { config: any }) => {
  const migrator = await initMigrator(config);

  if (await migrator.isLocked()) {
    const time = timer();

    await migrator.unlock(); // Returns a promise

    logger.info(`Migration state unlocked.`);

    logger.info(`Time spent: ${time.spent()} sec`);
  } else {
    logger.info(`Migration state is already unlocked.`);
  }
};
