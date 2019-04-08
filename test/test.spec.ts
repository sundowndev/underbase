// tslint:disable:no-console
// tslint:disable:no-empty

import { Promise as BlueBirdPromise } from 'bluebird';
import { Collection, Db, MongoClient } from 'mongodb';
import * as sinon from 'sinon';
import { prototype } from 'stack-utils';
import { Migration } from '../src/';

let dbClient;
const collectionName = '_migration';
const dbURL = process.env.DBURL;

describe('Migration', () => {
  let migrator: Migration;
  let migrationsList: any[];
  let configObject: any;

  beforeAll(async () => {
    try {
      // sinon.stub(Db.prototype, 'collection').returns(mongoStub as any);

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
      name: 'Version 1',
      up: (db) => {
        return 'done';
      },
      down: (db) => {
        return 'done';
      },
    });

    migrator.add(migrationsList[1]);

    migrationsList.push({
      version: 2,
      name: 'Version 2',
      up: (db) => {
        return 'done';
      },
      down: (db) => {
        return 'done';
      },
    });

    migrator.add(migrationsList[2]);
  });

  afterEach(async () => {
    await migrator.reset();
  });

  describe('#migrateTo', () => {
    test('1 from 0, should migrate to v1', async () => {
      let currentVersion = await migrator.getVersion();
      expect(currentVersion).toBe(0);
      await migrator.migrateTo(1);
      currentVersion = await migrator.getVersion();
      expect(currentVersion).toBe(1);
    });

    test('2 from 0, should migrate to v2', async () => {
      let currentVersion = await migrator.getVersion();
      expect(currentVersion).toBe(0);
      await migrator.migrateTo(2);
      currentVersion = await migrator.getVersion();
      expect(currentVersion).toBe(2);
    });

    test(`'latest' from 0, should migrate to v2`, async () => {
      let currentVersion = await migrator.getVersion();
      expect(currentVersion).toBe(0);
      await migrator.migrateTo('latest');
      currentVersion = await migrator.getVersion();
      expect(currentVersion).toBe(2);
    });

    test('from 2 to 1, should migrate to v1', async () => {
      await migrator.migrateTo('2');
      let currentVersion = await migrator.getVersion();
      expect(currentVersion).toBe(2);

      await migrator.migrateTo(1);
      currentVersion = await migrator.getVersion();
      expect(currentVersion).toBe(1);
    });

    test('from 2 to 0, should migrate to v0', async () => {
      await migrator.migrateTo('2');
      let currentVersion = await migrator.getVersion();
      expect(currentVersion).toBe(2);

      await migrator.migrateTo(0);
      currentVersion = await migrator.getVersion();
      expect(currentVersion).toBe(0);
    });

    test('rerun 0 to 0, should migrate to v0', async () => {
      let currentVersion = await migrator.getVersion();
      expect(currentVersion).toBe(0);

      await migrator.migrateTo('0,rerun');
      currentVersion = await migrator.getVersion();
      expect(currentVersion).toBe(0);
    });

    describe('With async(async/await and Promise) up() & down()', () => {
      beforeEach(() => {
        migrator.add({
          version: 3,
          name: 'Version 3.',
          up: async (db) => {
            return 'done';
          },
          down: async (db) => {
            return 'done';
          },
        });

        migrator.add({
          version: 4,
          name: 'Version 4',
          up: BlueBirdPromise.method((db) => {
            return 'done';
          }),
          down: BlueBirdPromise.method((db) => {
            return 'done';
          }),
        });
      });

      test('from 0 to 3, should migrate to v3', async () => {
        let currentVersion = await migrator.getVersion();
        expect(currentVersion).toBe(0);
        await migrator.migrateTo(3);
        currentVersion = await migrator.getVersion();
        expect(currentVersion).toBe(3);
      });

      test('from 0 to 4, should migrate to v4', async () => {
        let currentVersion = await migrator.getVersion();
        expect(currentVersion).toBe(0);
        await migrator.migrateTo(4);
        currentVersion = await migrator.getVersion();
        expect(currentVersion).toBe(4);
      });
    });

    describe('On Error', () => {
      beforeEach(() => {
        migrator.add({
          version: 3,
          name: 'Version 3.',
          up: async (db) => {},
          down: async (db) => {},
        });

        migrator.add({
          version: 4,
          name: 'Version 4.',
          up: async (db) => {},
          down: async (db) => {
            throw new Error('Something went wrong');
          },
        });

        migrator.add({
          version: 5,
          name: 'Version 5.',
          up: async (db) => {
            throw new Error('Something went wrong');
          },
          down: async (db) => {},
        });
      });

      test('from 0 to 5, should stop migration at v4 due to error from v4 to v5', async () => {
        let currentVersion = await migrator.getVersion();
        expect(currentVersion).toBe(0);
        try {
          await migrator.migrateTo(5);
        } catch (e) {
          expect(e).toBeTruthy();
          expect(e).toBeInstanceOf(Error);
        }
        currentVersion = await migrator.getVersion();
        expect(currentVersion).toBe(4);
      });

      test('from 4 to 3, should stop migration at 4 due to error from v4 to v3', async () => {
        await migrator.migrateTo(4);
        let currentVersion = await migrator.getVersion();
        expect(currentVersion).toBe(4);
        try {
          await migrator.migrateTo(3);
        } catch (e) {
          expect(e).toBeTruthy();
          expect(e).toBeInstanceOf(Error);
        }
        currentVersion = await migrator.getVersion();
        expect(currentVersion).toBe(4);
      });
    });
  });

  describe('#isLocked', () => {
    test(`should be unlocked`, async () => {
      const locked = await migrator.isLocked();
      expect(locked).toBe(false);
    });

    test(`should be locked`, async () => {
      await dbClient.collection(collectionName).updateOne(
        {
          _id: 'control',
        },
        {
          $set: {
            version: 1,
            locked: true,
          },
        },
        {
          upsert: true,
        },
      );

      const locked = await migrator.isLocked();

      expect(locked).toBe(true);
    });
  });

  describe('#getConfig', () => {
    test('should return config objet', () => {
      const config = migrator.getConfig();

      expect(config).toMatchObject(configObject);
    });
  });

  describe('#getMigrations', () => {
    test('should return migrations array', () => {
      const migrations = migrator.getMigrations();

      migrations.forEach((m) => {
        expect(m).toHaveProperty('version');
        expect(m).toHaveProperty('up');

        if (m.version !== 0) {
          expect(m).toHaveProperty('name');
          expect(m).toHaveProperty('down');
        }
      });
    });
  });
});
