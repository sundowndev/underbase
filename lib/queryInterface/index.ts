// tslint:disable:variable-name
import { Collection, Db } from 'mongodb';
import { MongoCollection } from './MongoCollection';

export class QueryInterface {
  public cursorOptions: any;

  private _db: Db;
  private _collection: Collection;

  constructor(db: Db) {
    this._db = db;
  }

  public collection = (name: string): MongoCollection => {
    this._collection = this._db.collection(name);

    return new MongoCollection(name, this._collection, this._db);
  }
}
