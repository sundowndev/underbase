// tslint:disable no-console

import { IConfigFile } from '@underbase/types';
import { exit, logger } from '@underbase/utils';
import { exec } from 'child_process';

export const create = (config: IConfigFile, version: number) =>
  new Promise(resolve => {
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

    exec(cmd, error => {
      if (error) {
        logger.error(
          'An error occured while creating backup... Cancelling migration.',
        );
        console.error(error);
        exit(1);
      }

      logger.info(`Backup created : ${config.backupsDir}/${backupFile}`);

      return resolve();
    });
  });
