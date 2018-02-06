
// tslint:disable:no-console
// tslint:disable:no-empty

import { Migration } from '../src/';

const dbURL = process.env.DBURL;

describe('Migration', () => {

  let migrator: Migration;

  beforeAll(async () => {
    try {
      migrator = new Migration({
        log: true,
        logIfLatest: true,
        collectionName: '_migration',
        db: dbURL,
      });
      await migrator.config();
    } catch (e) {
      console.log(e);
      throw e;
    }
  });

  beforeEach(() => {
    migrator.add({
      version: 1,
      name: 'Version 1',
      up: (db) => {
      },
      down: (db) => {
      },
    });

    migrator.add({
      version: 2,
      name: 'Version 2',
      up: (db) => {
      },
      down: (db) => {
      },
    });

  });

  afterEach(async () => {
    await migrator._reset();
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

    describe('On Error', () => {

      beforeEach(() => {
        migrator.add({
          version: 3,
          name: 'Version 3.',
          up: (db) => {
            throw new Error('Something went wrong');
          },
          down: (db) => {
          },
        });
      });

      test('from 0 to 3, should stop migration at v2 due to error from v2 to v3', async () => {
        let currentVersion = await migrator.getVersion();
        expect(currentVersion).toBe(0);
        try {
          await migrator.migrateTo(3);
        } catch (e) {
          expect(e).toBeTruthy();
          expect(e).toBeInstanceOf(Error);
        }
        currentVersion = await migrator.getVersion();
        expect(currentVersion).toBe(2);
      });

    });

  });

});
