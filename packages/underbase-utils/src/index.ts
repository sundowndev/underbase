// tslint:disable:no-console
import { ILogger } from '@underbase/types';
import chalk from 'chalk';

/**
 * CLI logging
 *
 * @ignore
 * @private
 * @returns object
 */
export const logger: ILogger = {
  info: (...args: string[]) => {
    console.log(chalk.bold('[INFO]'), ...args);
  },
  warn: (...args: string[]) => {
    console.log(chalk.bold('[WARNING]'), ...args);
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
  process.exit(code);
};

/**
 * Import migration files
 * @param {string} path - Path to file to be imported
 * @ignore
 * @private
 */
export const importFile = async (path: string, compiler?: string) => {
  const registerCompiler = async (module: string) => {
    switch (module) {
      case 'babel-register': {
        const babel = require('@babel/register');
        return babel({ extensions: ['.js'], cache: false });
      }
      case 'ts-node': {
        const tsNode = require('ts-node');
        return tsNode({ transpileOnly: true });
      }
      default: {
        logger.warn('Compiler was not reconized, skipping.');
      }
    }
  };

  if (compiler) {
    registerCompiler(compiler);
  }

  try {
    const file = await import(path);

    if (typeof file.default.up === 'function') {
      return file.default;
    } else if (typeof file.up === 'function') {
      return file;
    } else {
      logger.error(
        `Underbase was not able to validate the migration object for file`,
        path,
        'Did you forget the default keyword ?',
      );
      exit(1);
    }
  } catch (error) {
    throw new Error(error);
  }
};
