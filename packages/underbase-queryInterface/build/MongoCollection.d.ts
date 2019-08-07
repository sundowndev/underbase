import { Collection, Db } from 'mongodb';
interface IQuery {
    where: (query?: object) => Promise<any>;
}
export declare class MongoCollection {
    cursorOptions: any;
    private _db;
    private _collectionName;
    private _collection;
    private _updateQuery;
    private _whereQuery;
    constructor(collectionName: string, collection: Collection, db: Db);
    rename: (fieldName: string, newFieldName: string) => IQuery;
    unset: (fieldName: string | string[]) => IQuery;
    set: (fieldName: string, value: any) => IQuery;
    drop: () => Promise<any>;
    count: (query?: object) => Promise<any>;
    private where;
    private execute;
    private cursor;
}
export {};
//# sourceMappingURL=MongoCollection.d.ts.map