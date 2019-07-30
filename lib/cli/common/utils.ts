// tslint:disable:no-console
import chalk from 'chalk';
import { migrator } from '../../index';
import { IConfigFile } from '../../interfaces';

/**
 * Initialize migrator constructor
 * @param {IConfigFile} config - Config object
 * @ignore
 * @private
 */
export const initMigrator = async (config: IConfigFile) => {
  logger.info('Connecting to MongoDB...');

  await migrator.config(config); // Returns a promise

  return migrator;
};

/**
 * CLI logging
 *
 * @ignore
 * @private
 * @returns object
 */
export const logger: any = {
  info: (...args: string[]) => {
    console.log('[INFO]', ...args);
  },
  warn: (...args: string[]) => {
    console.log(chalk.bgYellow('WARNING'), ...args);
  },
  success: (...args: string[]) => {
    console.log(chalk.green(`✔ ${args.join(' ')}`));
  },
  error: (...args: string[]) => {
    console.log(chalk.bgRed('ERROR'), chalk.red(`${args.join(' ')}`));
  },
  log: (...args: string[]) => {
    console.log(...args);
  },
};

/**
 * Runtime timer
 * @ignore
 * @private
 */
export const timer = () => {
  const t0 = new Date().getTime();

  return {
    spent() {
      const t1 = new Date().getTime();

      return (t1 - t0) / 1000;
    },
  };
};

/**
 * Exits Underbase
 * @param {number} code - Exit code; typically # of failures
 * @ignore
 * @private
 */
export const exit = (code: number = 0) => {
  process.exit();
};

/**
 * Import migration files
 * @param {string} path - Path to file to be imported
 * @ignore
 * @private
 */
export const importFile = async (path: string) => {
  // tslint:disable-next-line: no-var-requires
  require = require('esm')(module);

  try {
    const file = await require(path);

    return file.default;
  } catch (error) {
    throw new Error(error);
  }
};
