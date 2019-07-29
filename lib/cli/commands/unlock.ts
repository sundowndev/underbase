import { initMigrator, logger, timer } from '../common/utils';

export default async ({ config }) => {
  const migrator = await initMigrator(config);

  if (await migrator.isLocked()) {
    const time = timer();

    await migrator.unlock(); // Returns a promise

    logger('[INFO]', `Migration state unlocked.`);

    logger('[INFO]', `Time spent: ${time.spent()} sec`);
  } else {
    logger('[INFO]', `Migration state is already unlocked.`);
  }
};
