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
  name: string;
  up: (db: any) => Promise<any> | any;
  down: (db: any) => Promise<any> | any;
}