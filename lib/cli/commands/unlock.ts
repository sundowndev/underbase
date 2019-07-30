import { initMigrator, logger, timer } from '../common/utils';

export default async ({ config }) => {
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
