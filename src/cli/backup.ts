// tslint:disable no-console

import { exec } from 'child_process';
import { logger } from './utils';

export const create = (
  mongodumpBinary: string,
  version: number,
  backupsDir: string,
) =>
  new Promise((resolve, reject) => {
    logger('info', 'Creating backup...');

    const host = 'localhost:27017'; // TODO: replace this
    const database = 'underbase_test'; // TODO: replace this

    const backupFile = [version.toFixed(1), `${Date.now()}.gz`].join('_');

    const cmd = [
      mongodumpBinary,
      `--host ${host}`,
      `--archive=${backupsDir}/${backupFile}`,
      `--gzip --db ${database}`,
    ].join(' ');

    exec(cmd, (error, stdout, stderr) => {
      if (error) {
        logger(
          'error',
          'An error occured while creating backup... Cancelling.',
        );
        console.error(error);
        process.exit();
      }

      logger('success', 'Backup created : ' + backupFile);

      return resolve();
    });
  });
