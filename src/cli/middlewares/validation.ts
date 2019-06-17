import * as fs from 'fs-extra';
import { IConfigFile } from '../common/interfaces';
import { exit, logger } from '../common/utils';

export const checkNoArgPassed = (argv: any) => {
  if (!argv._[0]) {
    logger('info', 'Use --help to show available commands.');
    exit();
  }
};

export const checkMigrationDirExists = (config: IConfigFile) => {
  if (!fs.existsSync(config.migrationsDir)) {
    logger(
      'info',
      'Migration directory does not exists. Please run underbase init.',
    );
  }
};

export const createbackupDir = (config: IConfigFile) => {
  if (!fs.existsSync(config.backupsDir) && config.backup) {
    fs.mkdirpSync(config.backupsDir);
    logger('info', 'Created backup directory.');
  }
};
