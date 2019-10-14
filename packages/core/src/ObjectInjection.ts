import { QueryInterface } from '@underbase/query-interface';
import { IMigrationUtils } from '@underbase/types';
import chalk from 'chalk';

const getMigrationUtils = (): IMigrationUtils => {
  const logLevel = 8;

  return {
    MongoClient: config._db as Db,
    Migrate: async (migrations: Array<Promise<any>> | any[]) => {
      for (const i in migrations) {
        if (migrations.hasOwnProperty(i)) {
          if (
            migrations[i][direction].constructor.name !== 'AsyncFunction' &&
            migrations[i][direction].constructor.name !== 'Promise'
          ) {
            config.options.logger.warn(
              `One of the ${direction} functions is nor Async or Promise`,
              `(${migrations[i].describe || 'not described'})`,
            );
          }

          if (migrations[i].describe) {
            config.options.logger.log(
              ' '.repeat(logLevel),
              chalk.grey(migrations[i].describe),
            );
          }

          try {
            await migrations[i][direction](getMigrationUtils());
          } catch (error) {
            throw new Error(error);
          }
        }
      }
    },
    Query: new QueryInterface(config._db),
    Logger: (...args: string[]) =>
      config.options.logger.log(
        ' '.repeat(logLevel),
        chalk.inverse(' LOGGER '),
        ...args,
      ),
  };
};

export { getMigrationUtils };
