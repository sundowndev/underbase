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
  const registerCompiler = (module: string) => {
    switch (module) {
      case 'babel-register': {
        require('@babel/register')({
          extensions: ['.js'],
          cache: false,
        });
        return;
      }
      case 'ts-node': {
        require('ts-node').register({ transpileOnly: true });
        return;
      }
    }
  };

  if (compiler) {
    registerCompiler(compiler);
  }

  try {
    const file = await import(path);

    if (file.default.up) {
      return file.default;
    } else {
      return file;
    }
  } catch (error) {
    throw new Error(error);
  }
};
