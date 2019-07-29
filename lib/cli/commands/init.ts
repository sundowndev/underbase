import * as fs from 'fs-extra';
import { logger } from '../common/utils';

export default async ({ config }) => {
  if (!fs.existsSync(config.migrationsDir)) {
    await fs.mkdirpSync(config.migrationsDir);
    logger('[INFO]', 'Created migration directory.');
  } else {
    logger('[INFO]', 'Migration directory already exists.');
  }

  if (!fs.existsSync(config.backupsDir) && config.backup) {
    await fs.mkdirpSync(config.backupsDir);

    logger('[INFO]', 'Created backup directory.');
  }
};
