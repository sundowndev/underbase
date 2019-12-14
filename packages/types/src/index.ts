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
  logs?: boolean;
  logger: ILogger;
  logIfLatest?: boolean;
  require?: string | undefined;
  supportFile?: string | undefined;
}

interface IMigrationUtils {
  MongoClient: Db;
  Migrate: (migrations: IMigration[]) => Promise<void>;
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
  info: (...args: unknown[]) => void;
  warn: (...args: unknown[]) => void;
  success: (...args: unknown[]) => void;
  error: (...args: unknown[]) => void;
  log: (...args: unknown[]) => void;
}

interface ICommand {
  command: string;
  describe: string;
  action: TCommandAction;
}

type TCommandAction = (options: ICommandActionOptions) => Promise<void>;

interface ICommandActionOptions {
  config: IConfigFile;
  versions: string[];
  argv: any;
}

enum EDirection {
  up = 'up',
  down = 'down',
}

export {
  IMigrationOptions,
  IConfigFile,
  IMigrationUtils,
  IMigration,
  ILogger,
  QueryInterface,
  ICommand,
  ICommandActionOptions,
  EDirection,
  TCommandAction,
};
