import { IConfigFile } from '../../interfaces';
import { initMigrator, logger } from '../common/utils';

export default async ({ config }) => {
  const migrator = await initMigrator(config as IConfigFile);

  const currentVersion = await migrator.getVersion();
  const isLocked = (await migrator.isLocked()) ? 'locked' : 'not locked';

  logger('[INFO]', `Current version is ${currentVersion}`);
  logger('[INFO]', `Migration state is ${isLocked}`);
};
