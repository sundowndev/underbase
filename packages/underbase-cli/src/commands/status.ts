import { IConfigFile } from '@underbase/types';
import { logger } from '@underbase/utils';
import { initMigrator } from '../common/utils';

export const command = 'status';
export const describe = 'Show migrations status';
export const action = async ({ config }: { config: any }) => {
  const migrator = await initMigrator(config as IConfigFile);

  const currentVersion = await migrator.getVersion();
  const isLocked = (await migrator.isLocked()) ? 'locked' : 'not locked';

  logger.info(`Current version is ${currentVersion}`);
  logger.info(`Migration state is ${isLocked}`);
};
