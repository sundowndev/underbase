import { Db } from 'mongodb';
import { QueryInterface } from './queryInterface';

export type SyslogLevels =
  | 'debug'
  | 'info'
  | 'notice'
  | 'warning'
  | 'error'
  | 'crit'
  | 'alert';

export interface IMigrationOptions {
  logs?: boolean;
  logger?: any;
  logIfLatest?: boolean;
  collectionName?: string;
  db: string | Db;
}

export interface IConfigFile {
  collectionName?: string;
  backup?: boolean;
  backupsDir?: string;
  migrationsDir?: string;
  db: string;
  logs: boolean;
  logger: any;
  logIfLatest?: boolean;
  chdir?: string;
  mongodumpBinary: string;
}

export interface IMigration {
  version: number;
  describe: string;
  up: (db: QueryInterface) => Promise<any> | any;
  down: (db: QueryInterface) => Promise<any> | any;
}
