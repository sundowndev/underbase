// tslint:disable no-console

import { exec } from 'child_process';
import { IConfigFile } from '../../interfaces';
import { logger } from './utils';

export const create = (config: IConfigFile, version: number) =>
  new Promise((resolve, reject) => {
    logger.info('Creating backup...');

    const dbUrlSegments = config.db.split('/');

    let host: string;
    let database: string;

    if (dbUrlSegments[0] === 'mongodb:' && dbUrlSegments[1] === '') {
      host = dbUrlSegments[2];
      database = dbUrlSegments[3];
    } else {
      host = dbUrlSegments[0];
      database = dbUrlSegments[1];
    }

    const backupFile = [version.toFixed(1), `${Date.now()}.gz`].join('_');

    const cmd = [
      config.mongodumpBinary,
      `--host ${host}`,
      `--archive=${config.backupsDir}/${backupFile}`,
      `--gzip --db ${database}`,
    ].join(' ');

    exec(cmd, (error, stdout, stderr) => {
      if (error) {
        logger.error('An error occured while creating backup... Cancelling.');
        console.error(error);
        process.exit();
      }

      logger.info(`Backup created : ${config.backupsDir}/${backupFile}`);

      return resolve();
    });
  });
