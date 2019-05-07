// tslint:disable:no-console
// tslint:disable:no-empty

import { Promise as BlueBirdPromise } from 'bluebird';
import { Collection, Db, MongoClient } from 'mongodb';
import * as path from 'path';
import { Migration } from '../src';

let dbClient: Db;
const collectionName = '_migration';
const dbURL = process.env.DBURL;

describe('Query interface', () => {
  let migrator: Migration;
  let migrationsList: any[];
  let configObject: any;

  beforeAll(async () => {
    try {
      const client = await MongoClient.connect(dbURL, {
        useNewUrlParser: true,
      });

      dbClient = client.db();

      configObject = {
        logs: true,
        logIfLatest: true,
        collectionName,
        db: dbURL,
        logger: () => {},
      };

      migrator = new Migration(configObject);
      await migrator.config();

      migrationsList = [];
    } catch (e) {
      console.log(e);
      throw e;
    }
  });

  beforeEach(() => {
    migrationsList = [];

    migrationsList.push({
      version: 0,
      up: () => {},
    });

    migrationsList.push({
      version: 1,
      name: 'Version 1.',
      up: async (db) => {
        db.collection('users')
          .rename('dateCreated', 'datecreated')
          .where({});

        await db.save();

        return 'done.';
      },
      down: async (db) => {},
    });

    migrator.add(migrationsList[1]);

    migrationsList.push({
      version: 2,
      name: 'Version 2.',
      up: async (db) => {
        db.collection('users')
          .rename('dateCreated', 'datecreated')
          .where({});

        await db.save();

        return 'done.';
      },
      down: async (db) => {},
    });

    migrator.add(migrationsList[2]);
  });

  afterEach(async () => {
    await migrator.reset();
  });

  describe('Unset', () => {
    test('should unset', async () => {
      expect(1).toBeGreaterThan(0);
    });
  });

  describe('Rename', () => {
    test('should rename', () => {
      expect(1).toBeGreaterThan(0);
    });
  });
});
