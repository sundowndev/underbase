import * as fs from 'fs-extra';
import { logger } from '../common/utils';

export default ({ config, versions }) => {
  if (fs.existsSync(config.migrationsDir)) {
    logger('info', 'Versions list based on folders');

    versions.forEach((v: string) => console.log(`- ${v}`));
  }
};
