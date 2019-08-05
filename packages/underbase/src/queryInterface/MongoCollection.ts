// tslint:disable:variable-name
import { Collection, Db } from 'mongodb';

interface IQuery {
  where: (query?: object) => Promise<any>;
}

export class MongoCollection {
  public cursorOptions: any;

  private _db: Db;
  private _collectionName: string;
  private _collection: Collection;
  private _updateQuery: object;
  private _whereQuery: object;

  constructor(collectionName: string, collection: Collection, db: Db) {
    this._db = db;
    this._collectionName = collectionName;
    this._collection = collection;
    this._updateQuery = {};
    this._whereQuery = {};
    this.cursorOptions = {
      cursor: {
        batchSize: 500,
      },
      allowDiskUse: true,
    };
  }

  public rename = (fieldName: string, newFieldName: string): IQuery => {
    const renameQuery = {};

    renameQuery[fieldName] = newFieldName;

    this._updateQuery = {
      $rename: renameQuery,
    };

    return { where: this.where };
  }

  public unset = (fieldName: string | string[]): IQuery => {
    const unsetQuery = {};

    if (typeof fieldName === 'string') {
      unsetQuery[fieldName as string] = 1;
    } else if (Array.isArray(fieldName)) {
      for (const field of fieldName) {
        unsetQuery[field] = 1;
      }
    } else {
      throw new Error('Field name in .unset() must of type string or array.');
    }

    this._updateQuery = {
      $unset: unsetQuery,
    };

    return { where: this.where };
  }

  public set = (fieldName: string, value: any): IQuery => {
    const setQuery = {};

    setQuery[fieldName] = value;

    this._updateQuery = {
      $set: setQuery || {},
    };

    return { where: this.where };
  }

  public drop = async (): Promise<any> => {
    return await this._db.dropCollection(this._collectionName);
  }

  public count = async (query: object = {}): Promise<any> => {
    this._whereQuery = query;

    return await this._collection.find(this._whereQuery, {}).count();
  }

  private where = async (query: object = {}): Promise<any> => {
    this._whereQuery = query;

    return await this.execute();
  }

  private execute = async (): Promise<any> => {
    return await this.cursor(this._whereQuery, (doc: any) => {
      this._collection.updateOne(
        {
          _id: doc._id,
        },
        this._updateQuery,
      );
    });
  }

  private cursor = async (query: object, cb: any): Promise<any> => {
    return new Promise(async (resolve, reject) => {
      const cursor = await this._collection.aggregate(
        [
          {
            $match: query || {},
          },
        ],
        this.cursorOptions,
      );

      cursor.on('data', (doc: object) => cb(doc));
      cursor.on('close', () => reject('MongoDB closed the connection'));
      cursor.on('end', () => resolve());
    });
  }
}
