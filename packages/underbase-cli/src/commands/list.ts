import { logger } from '@underbase/utils';
import * as fs from 'fs-extra';

exports.command = 'list';
exports.describe = 'Show available migrations versions';
exports.action = async ({
  config,
  versions,
}: {
  config: any;
  versions: string[];
}) => {
  if (fs.existsSync(config.migrationsDir)) {
    logger.info('Versions list based on folders');

    versions.forEach((v: string) => logger.log(`- ${v}`));
  }
};
