import * as fs from 'fs-extra';
import { logger } from '../common/utils';

export default async ({ config, versions }) => {
  if (fs.existsSync(config.migrationsDir)) {
    logger('[INFO]', 'Versions list based on folders');

    versions.forEach((v: string) => logger(`- ${v}`));
  }
};
