import { Db } from 'mongodb';
import { MongoCollection } from './MongoCollection';
export declare class QueryInterface {
    cursorOptions: any;
    private _db;
    private _collection;
    constructor(db: Db);
    collection: (name: string) => MongoCollection;
}
//# sourceMappingURL=index.d.ts.map