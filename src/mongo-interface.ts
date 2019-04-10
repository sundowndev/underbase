// tslint:disable:variable-name
// tslint:disable:forin

import { Collection, Db } from 'mongodb';
import { logger } from './cli/utils';

export class MongoInterface {
  private collectionName: string;
  private _db: Db;
  private _collection: Collection;

  constructor(db: Db) {
    this._db = db;
  }

  public getClient(): Db {
    return this._db;
  }

  public async cursor(query: object, cb: any): Promise<any> {
    const cursor = await this._collection.find(query || {});

    await cursor.forEach((doc) => {
      console.log(doc);

      cb(doc);
    });
  }

  public collection(name: string): any {
    const self = this;
    self.collectionName = name;
    self._collection = self.getClient().collection(name);

    const applySchema = (schema: any) => {
      for (const key in schema) {
        for (const action in schema[key]) {
          switch (action) {
            case '$delete': {
              console.log(
                `delete field ${key} where`,
                schema[key][action].$where || {},
              );
              break;
            }
            case '$rename': {
              console.log(
                `rename field ${key} to ${schema[key][action].$name} where`,
                schema[key][action].$where || {},
              );
              break;
            }
          }
        }
      }
    };

    const rename = (fieldName: string, newFieldName: string): any => {
      const renameQuery = {};
      let query = {};

      const execute = () => {
        renameQuery[fieldName] = newFieldName;

        self.cursor(query, (doc: any) => {
          self._collection.updateOne(
            {
              _id: doc._id,
            },
            {
              $rename: renameQuery,
            },
          );
        });
      };

      return {
        where: (where: any) => {
          query = where;
          renameQuery[fieldName] = 1;

          return execute();
        },
      };
    };

    const unset = (fieldName: string): any => {
      const unsetQuery = {};
      let query = {};

      return {
        where: async (where: any) => {
          query = where;
          unsetQuery[fieldName] = 1;

          return await self.cursor(query, (doc: any) => {
            self._collection.updateOne(
              {
                _id: doc._id,
              },
              {
                $unset: unsetQuery || {},
              },
            );
          });
        },
      };
    };

    const drop = async (): Promise<any> => {
      await self.getClient().dropCollection(name, (err, affect) => null);

      logger('info', 'Deleted collection ' + name);
    };

    return { applySchema, rename, drop, unset };
  }
}
