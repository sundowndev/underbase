import { QueryInterface } from '@underbase/query-interface';
import { Db } from 'mongodb';
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
export interface IMigrationUtils {
    MongoClient: Db;
    Migrate: any;
    Query: QueryInterface;
    Logger: (...args: string[]) => {};
}
export interface IMigration {
    version: number;
    describe: string;
    up: (db: IMigrationUtils) => Promise<any> | any;
    down: (db: IMigrationUtils) => Promise<any> | any;
}
//# sourceMappingURL=index.d.ts.map