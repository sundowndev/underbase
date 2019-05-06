// tslint:disable:variable-name
// tslint:disable:forin

import { Collection, Db } from 'mongodb';
import { logger } from './cli/utils';

interface ICollection {
  applySchema: (schema: any) => any;
  rename: (fieldName: string, newFieldName: string) => any;
  unset: (fieldName: string | string[]) => any;
  set: (fieldName: string, newFieldName: string) => any;
  drop: () => any;
  iterate: (query: any, cb: any) => any;
  remove: () => any;
}

export class MongoInterface {
  public cursorOptions: any;

  private collectionName: string;
  private _db: Db;
  private _collection: Collection;
  private _actions: any[];

  constructor(db: Db) {
    this._db = db;
    this._actions = [];
    this.cursorOptions = {
      cursor: {
        batchSize: 500,
      },
      allowDiskUse: true,
    };
  }

  public getDb(): Db {
    return this._db;
  }

  public collection(name: string): ICollection {
    const self = this;
    self.collectionName = name;
    self._collection = self.getDb().collection(name);

    let _updateQuery = {};
    let _where = {};

    const execute = () => {
      return self.cursor(_where || {}, (doc: any) => {
        self._collection.updateOne(
          {
            _id: doc._id,
          },
          _updateQuery,
        );
      });
    };

    const applySchema = (schema: any) => {
      for (const field in schema) {
        for (const action in schema[field]) {
          _where = schema[field][action].$where || {};
          _updateQuery[action] = {};
          _updateQuery[action][field] =
            action === '$rename' ? schema[field][action].$name : 1;

          execute();
        }
      }
    };

    const rename = (fieldName: string, newFieldName: string): any => {
      const renameQuery = {};

      return {
        where: (where: any) => {
          _where = where || {};
          renameQuery[fieldName] = newFieldName;

          _updateQuery = {
            $rename: renameQuery,
          };

          return execute();
        },
      };
    };

    const unset = (fieldName: string | string[]): any => {
      const unsetQuery = {};

      return {
        where: (where: any) => {
          if (typeof fieldName === 'string') {
            unsetQuery[fieldName as string] = 1;
          } else if (Array.isArray(fieldName)) {
            for (const field of fieldName) {
              unsetQuery[field] = 1;
            }
          } else {
            throw new Error(
              'Field name in .unset() must of type string or array.',
            );
          }

          _where = where || {};
          _updateQuery = {
            $unset: unsetQuery || {},
          };

          return execute();
        },
      };
    };

    const set = (fieldName: string, value: string | boolean | number): any => {
      const setQuery = {};

      return {
        where: (where: any) => {
          setQuery[fieldName] = value;
          _where = where || {};
          _updateQuery = {
            $set: setQuery || {},
          };

          return execute();
        },
      };
    };

    const remove = (): any => {
      return {
        where: (where: any) => {
          _where = where || {};

          return self.cursor(_where, (doc: any) => {
            self._collection.deleteOne({
              _id: doc._id,
            });
          });
        },
      };
    };

    const drop = (): any => {
      const action = new Promise(async (resolve, reject) => {
        await self.getDb().dropCollection(name, (err, affect) => resolve());

        logger('info', 'Deleted collection ' + name);
      });

      this._actions.push(action);
    };

    const iterate = (where: any, cb: any): any => {
      _where = where || {};

      return self.cursor(_where, cb);
    };

    return { applySchema, rename, unset, set, remove, drop, iterate };
  }

  public async save(): Promise<any> {
    try {
      return Promise.all(this._actions);
    } catch (error) {
      return new Error(error);
    }
  }

  private async cursor(query: object, cb: any): Promise<any> {
    const action = new Promise(async (resolve, reject) => {
      const cursor = await this._collection.aggregate(
        [
          {
            $match: query || {},
          },
        ],
        this.cursorOptions,
        null,
      );

      cursor.on('data', (doc) => {
        cb(doc);
      });

      cursor.on('close', () => {
        return reject('MongoDB closed the connection');
      });

      cursor.on('end', () => {
        return resolve();
      });
    });

    this._actions.push(action);
  }
}
