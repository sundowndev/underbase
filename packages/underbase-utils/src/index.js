/**
 * CLI logging
 *
 * @ignore
 * @private
 * @returns object
 */
export const logger: any = {
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