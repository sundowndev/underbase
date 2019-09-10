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
    console.log(chalk.reset.inverse(' INFO '), ...args);
  },
  warn: (...args: string[]) => {
    console.log(chalk.reset.inverse(' WARN '), chalk.grey(`${args.join(' ')}`));
  },
  success: (...args: string[]) => {
    console.log(chalk.reset.inverse.bold.green(` SUCCESS `), ...args);
  },
  error: (...args: string[]) => {
    console.log(chalk.reset.inverse.bold.red(` ERROR `), ...args);
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
  // const registerCompiler = async (module: string) => {
  //   switch (module) {
  //     case 'babel-register': {
  //       return require('@babel/register')({
  //         extensions: ['.js', '.ts'],
  //         cache: false,
  //       });
  //     }
  //     case 'ts-node': {
  //       return require('ts-node')({ transpileOnly: true });
  //     }
  //     default: {
  //       logger.error('Compiler was not reconized, skipping.');
  //     }
  //   }
  // };

  try {
    if (compiler) {
      // await registerCompiler(compiler);

      try {
        await import(compiler);
      } catch (e) {
        throw new Error(e);
      }
    }

    const file = await import(path);

    return typeof file.default === 'object' ? file.default : file;
  } catch (e) {
    throw new Error(e);
  }
};
