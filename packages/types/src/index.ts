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
  require?: string | undefined;
  supportFile?: string | undefined;
}

interface IMigrationUtils {
  MongoClient: Db;
  Migrate: (migrations: unknown[]) => void;
  Query: QueryInterface;
  Logger: (...args: string[]) => void;
}

interface IMigration {
  version: number;
  describe?: string;
  up: (db: IMigrationUtils) => Promise<unknown> | unknown;
  down: (db: IMigrationUtils) => Promise<unknown> | unknown;
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
