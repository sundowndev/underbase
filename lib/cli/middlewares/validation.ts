import * as fs from 'fs-extra';
import { IConfigFile } from '../../interfaces';
import { exit, logger } from '../common/utils';

export const checkNoArgPassed = (yargs: any, argv: any) => {
  if (!argv._[0]) {
    yargs.showHelp();
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
