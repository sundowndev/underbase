import { QueryInterface } from '@underbase/query-interface';
import {
  EDirection,
  ILogger,
  IMigration,
  IMigrationUtils,
} from '@underbase/types';
import chalk from 'chalk';
import { Db } from 'mongodb';

export class MigrationUtils {
  public utils: IMigrationUtils;
  private mongoClient: Db;
  private queryInterface: QueryInterface;
  private logger: ILogger;

  constructor(direction: EDirection, mongoClient: Db, logger: ILogger) {
    this.mongoClient = mongoClient;
    this.queryInterface = new QueryInterface(this.mongoClient);
    this.logger = logger;
    this.utils = {
      MongoClient: this.mongoClient,
      Query: this.queryInterface,
      Logger: this.loggerHelper(logger),
      Migrate: this.migrate(direction),
    };
  }

  private loggerHelper(logger: ILogger) {
    return (...args: string[]): void => {
      logger.log(' '.repeat(8), chalk.inverse(' LOGGER '), ...args);
    };
  }

  private migrate(
    direction: EDirection,
  ): (migrations: IMigration[]) => Promise<void> {
    return async (migrations: IMigration[]): Promise<void> => {
      const logLevel = 8;

      for (const migration of migrations) {
        if (
          migration[direction].constructor.name !== 'AsyncFunction' &&
          migration[direction].constructor.name !== 'Promise'
        ) {
          this.logger.warn(
            `One of the ${direction} functions is nor Async or Promise`,
            `(${migration.describe || 'not described'})`,
          );
        }

        if (migration.describe) {
          this.logger.log(' '.repeat(logLevel), chalk.grey(migration.describe));
        }

        try {
          await migration[direction](this.utils);
        } catch (error) {
          throw new Error(error);
        }
      }
    };
  }
}
