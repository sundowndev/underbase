import { Db } from 'mongodb';
export interface IMigrationOptions {
    log?: boolean;
    logger?: (level, ...args) => void;
    logIfLatest?: boolean;
    collectionName?: string;
    dbUrl: string;
}
export interface IMigration {
    version: number;
    name: string;
    up: (db: Db) => void;
    down: (db: Db) => void;
}
export declare class Migration {
    private defaultMigration;
    private _list;
    private _collection;
    private _db;
    private options;
    constructor(opts?: IMigrationOptions);
    config(opts: any): Promise<void>;
    add(migration: IMigration): void;
    migrateTo(command: string | number): Promise<void>;
    getVersion(): Promise<number>;
    unlock(): void;
    _reset(): Promise<void>;
    private _migrateTo(version, rerun?);
    private _getControl();
    private _setControl(control);
    private _findIndexByVersion(version);
}
