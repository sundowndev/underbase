import { initMigrator } from '../common/utils';
import { logger } from '../common/utils';

export default async ({ config, versions, argv }) => {
  const migrator = await initMigrator(config);

  const currentVersion = await migrator.getVersion();
  const isLocked = (await migrator.isLocked()) ? 'locked' : 'not locked';

  logger('info', `Current version is ${currentVersion}`);
  logger('info', `Migration state is ${isLocked}`);
};
