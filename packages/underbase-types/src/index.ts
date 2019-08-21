import { QueryInterface } from '@underbase/query-interface';
import { Db } from 'mongodb';

interface IMigrationOptions {
  logs?: boolean;
  logger?: any;
  logIfLatest?: boolean;
  collectionName?: string;
  db: string | Db;
}

interface IConfigFile {
  collectionName?: string;
  migrationsDir?: string;
  db: string;
  logs: boolean;
  logger: any;
  logIfLatest?: boolean;
  compiler: string | undefined;
  supportFile: string | undefined;
}

interface IMigrationUtils {
  MongoClient: Db;
  Migrate: any;
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
  info: (...args: string[]) => void;
  warn: (...args: string[]) => void;
  success: (...args: string[]) => void;
  error: (...args: string[]) => void;
  log: (...args: string[]) => void;
}

export {
  IMigrationOptions,
  IConfigFile,
  IMigrationUtils,
  IMigration,
  ILogger,
  QueryInterface,
};
