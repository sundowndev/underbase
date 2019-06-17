// tslint:disable:no-console
import { migrator } from '../../index';
import { IConfigFile } from '../common/interfaces';

export const initMigrator = async (config: IConfigFile) => {
  logger('info', 'Connecting to MongoDB...');

  await migrator.config(config); // Returns a promise

  return migrator;
};

export const logger = (level: string, ...arg: string[]) =>
  console.log(`[${level.toUpperCase()}]`, ...arg);

export const timer = () => {
  const t0 = new Date().getTime();

  return {
    spent() {
      const t1 = new Date().getTime();

      return (t1 - t0) / 1000;
    },
  };
};

export const exit = () => {
  process.exit();
};
