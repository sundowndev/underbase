// tslint:disable:variable-name
// tslint:disable:forin

import { Collection, Db } from 'mongodb';
import { logger } from './cli/utils';

export class MongoInterface {
  private collectionName: string;
  private _db: Db;

  constructor(db: Db) {
    this._db = db;
  }

  public getClient(): Db {
    return this._db;
  }

  public async cursor(collection: string, query: object, cb: any) {
    const cursor = this.getClient()
      .collection(collection)
      .find(query || {});

    // Iterate over the cursor
    cursor.forEach(async (doc) => {
      await cb(doc);
    });
  }

  public collection(name: string): any {
    const self = this;
    self.collectionName = name;

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

        self.cursor(self.collectionName, query || {}, (doc: any) => {
          self
            .getClient()
            .collection(name)
            .updateOne(
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

      const execute = () => {
        self.cursor(self.collectionName, query || {}, (doc: any) => {
          self
            .getClient()
            .collection(name)
            .updateOne(
              {
                _id: doc._id,
              },
              {
                $unset: unsetQuery || {},
              },
            );
        });
      };

      return {
        where: (where: any) => {
          query = where;
          unsetQuery[fieldName] = 1;

          return execute();
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
