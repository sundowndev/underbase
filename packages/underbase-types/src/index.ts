import { QueryInterface } from '@underbase/query-interface';
import { Db } from 'mongodb';

interface IMigrationOptions {
  logs?: boolean;
  logger: ILogger;
  logIfLatest?: boolean;
  collectionName?: string;
  db: string | Db;
}

interface IConfigFile {
  collectionName?: string;
  migrationsDir?: string;
  db: string;
  logs: boolean;
  logger: ILogger;
  logIfLatest?: boolean;
  compiler?: string | undefined;
  supportFile?: string | undefined;
}

interface IMigrationUtils {
  MongoClient: Db;
  Migrate: (migrations: any[]) => {};
  Query: QueryInterface;
  Logger: (...args: string[]) => {};
}

interface IMigration {
  version: number;
  describe: string;
  up: (db: IMigrationUtils) => Promise<any> | any;
  down: (db: IMigrationUtils) => Promise<any> | any;
}

interface ILogger {
  info: (...args: any[]) => void;
  warn: (...args: any[]) => void;
  success: (...args: any[]) => void;
  error: (...args: any[]) => void;
  log: (...args: any[]) => void;
}

export {
  IMigrationOptions,
  IConfigFile,
  IMigrationUtils,
  IMigration,
  ILogger,
  QueryInterface,
};
