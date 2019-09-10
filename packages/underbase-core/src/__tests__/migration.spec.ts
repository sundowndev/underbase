// tslint:disable:no-console
// tslint:disable:no-empty
import { logger } from '@underbase/utils';
import { Promise as BlueBirdPromise } from 'bluebird';
import { Db, MongoClient } from 'mongodb';
import { Migration } from '../index';

let connection: MongoClient;
let db: Db;
const collectionName = '_migration';
const dbURL = process.env.DBURL || 'mongodb://localhost:27017/underbase_test';

describe('INTEGRATION - Migration', () => {
  let migrator: Migration;
  let migrationsList: any[];
  let configObject: any;

  beforeAll(async () => {
    connection = await MongoClient.connect(dbURL, {
      useNewUrlParser: true,
    });

    db = connection.db();
  });

  beforeEach(async () => {
    configObject = {
      logs: true,
      logIfLatest: true,
      collectionName,
      db: dbURL,
      logger: {
        info: () => {},
        error: () => {},
        warn: () => {},
        success: () => {},
        log: () => {},
      },
    };

    migrator = new Migration(configObject);
    await migrator.config();

    migrationsList = [];

    migrationsList.push({
      version: 0,
      up: () => {},
    });

    migrationsList.push({
      version: 1,
      describe: 'Version 1',
      up: () => {
        return 'done';
      },
      down: () => {
        return 'done';
      },
    });

    migrator.add(migrationsList[1]);

    migrationsList.push({
      version: 2.0,
      describe: 'Version 2',
      up: () => {
        return 'done';
      },
      down: () => {
        return 'done';
      },
    });

    migrator.add(migrationsList[2]);
  });

  afterEach(async () => {
    await migrator.reset();
    await migrator.config(configObject);
  });

  afterAll(async () => {
    await connection.close();
  });

  describe('#config', () => {
    describe('logs option', () => {
      test('enable', async () => {
        configObject.logs = false;

        await migrator.config(configObject);

        expect(migrator.getConfig().logs).toBe(false);
      });

      test('disable', async () => {
        configObject.logs = true;

        await migrator.config(configObject);

        expect(migrator.getConfig().logs).toBe(true);
      });
    });

    describe('logger option', () => {
      test('default', async () => {
        configObject.logger = null;

        await migrator.config(configObject);

        expect(migrator.getConfig().logger).toBe(logger);
      });

      test('custom', async () => {
        configObject.logger = {
          info: () => {},
          error: () => {},
          warn: () => {},
          success: () => {},
          log: () => {},
        };

        await migrator.config(configObject);

        expect(migrator.getConfig().logger).toBe(configObject.logger);
      });
    });

    describe('db option', () => {
      test('custom db client connection', async () => {
        configObject.db = db;

        await migrator.config(configObject);

        expect(migrator.getConfig().db).toBe(configObject.db);
      });

      test('db is null', async () => {
        const config = {
          logs: true,
          logIfLatest: true,
          collectionName,
          db: null as any,
          logger: {
            info: () => {},
            error: () => {},
            warn: () => {},
            success: () => {},
            log: () => {},
          },
        };
        const migratorB = new Migration();

        try {
          await migratorB.config(config);
          expect(0).toBe(1);
        } catch (e) {
          expect(e).toBeTruthy();
          expect(e).toBeInstanceOf(ReferenceError);
        }

        expect(migratorB.getConfig().db).toBe(config.db);
      });
    });
  });

  describe('#migrateTo', () => {
    test('1 from 0, should migrate to v1', async () => {
      let currentVersion = await migrator.getVersion();
      expect(currentVersion).toBe(0);
      await migrator.migrateTo(1.0);
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
          version: 3.0,
          describe: 'Version 3.',
          up: async () => {
            return 'done';
          },
          down: async () => {
            return 'done';
          },
        });

        migrator.add({
          version: 4,
          describe: 'Version 4',
          up: BlueBirdPromise.method(() => {
            return 'done';
          }),
          down: BlueBirdPromise.method(() => {
            return 'done';
          }),
        });
      });

      test('from 0 to 3, should migrate to v3', async () => {
        let currentVersion = await migrator.getVersion();
        expect(currentVersion).toBe(0);
        await migrator.migrateTo(3.0);
        currentVersion = await migrator.getVersion();
        expect(currentVersion).toBe(3);
      });

      test('from 0 to 4, should migrate to v4', async () => {
        let currentVersion = await migrator.getVersion();
        expect(currentVersion).toBe(0);
        await migrator.migrateTo('4.0');
        currentVersion = await migrator.getVersion();
        expect(currentVersion).toBe(4);
      });
    });

    describe('On Error', () => {
      beforeEach(() => {
        migrator.add({
          version: 3,
          describe: 'Version 3.',
          up: async () => {},
          down: async () => {},
        });

        migrator.add({
          version: 4,
          describe: 'Version 4.',
          up: async () => {},
          down: async () => {
            throw new Error('Something went wrong');
          },
        });

        migrator.add({
          version: 5,
          describe: 'Version 5.',
          up: async () => {
            throw new Error('Something went wrong');
          },
          down: async () => {},
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

      test('version does not exists', async () => {
        try {
          await migrator.migrateTo(6);
        } catch (e) {
          expect(e).toBeTruthy();
          expect(e).toBeInstanceOf(Error);
        }
      });

      test('already on that version', async () => {
        await migrator.migrateTo(4);
        let currentVersion = await migrator.getVersion();
        expect(currentVersion).toBe(4);
        try {
          await migrator.migrateTo(4);
        } catch (e) {
          expect(e).toBeTruthy();
          expect(e).toBeInstanceOf(Error);
        }
        currentVersion = await migrator.getVersion();
        expect(currentVersion).toBe(4);
      });

      test('control is locked', async () => {
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

        try {
          await migrator.migrateTo(3);
        } catch (e) {
          expect(e).toBeTruthy();
          expect(e).toBeInstanceOf(Error);
        }
      });

      test('instance has not be configured', async () => {
        const migratorB = new Migration();
        try {
          await migratorB.migrateTo(3);
        } catch (e) {
          expect(e).toBeTruthy();
          expect(e).toBeInstanceOf(Error);
        }
      });

      test('cannot migrate using invalid command', async () => {
        await migrator.reset();
        try {
          await migrator.migrateTo('');
        } catch (e) {
          expect(e).toBeTruthy();
          expect(e).toBeInstanceOf(Error);
        }
      });
    });
  });

  describe('#unlock', () => {
    test(`should be locked`, async () => {
      // Lock migration state
      await db.collection(collectionName).updateOne(
        {
          _id: 'control',
        },
        {
          $set: {
            version: 1.0,
            locked: true,
          },
        },
        {
          upsert: true,
        },
      );

      expect(await migrator.isLocked()).toBe(true);

      // Unlock current state
      await migrator.unlock();

      expect(await migrator.isLocked()).toBe(false);
    });
  });

  describe('#isLocked', () => {
    test(`should be unlocked`, async () => {
      const locked = await migrator.isLocked();
      expect(locked).toBe(false);
    });

    test(`should be locked`, async () => {
      await db.collection(collectionName).updateOne(
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

      migrations.forEach(m => {
        expect(m).toHaveProperty('version');
        expect(m).toHaveProperty('up');

        if (m.version !== 0) {
          expect(m).toHaveProperty('describe');
          expect(m).toHaveProperty('down');
        }
      });
    });
  });

  describe('#getNumberOfMigrations', () => {
    test('returns the number of migrations (0)', async () => {
      await migrator.reset();
      const count = migrator.getNumberOfMigrations();
      expect(count).toBe(0);
    });

    test('returns the number of migrations (2)', () => {
      const count = migrator.getNumberOfMigrations();
      expect(count).toBe(2);
    });
  });

  describe('#add', () => {
    describe('OnError', () => {
      test('must supply an up function', () => {
        try {
          migrator.add({
            version: 1,
            describe: 'Version 1.',
            up: null as any,
            down: async () => {},
          });
          expect(0).toBe(1);
        } catch (e) {
          expect(e).toBeTruthy();
          expect(e).toBeInstanceOf(Error);
        }
      });

      test('must supply a down function', () => {
        try {
          migrator.add({
            version: 1,
            describe: 'Version 1.',
            up: async () => {},
            down: null as any,
          });
          expect(0).toBe(1);
        } catch (e) {
          expect(e).toBeTruthy();
          expect(e).toBeInstanceOf(Error);
        }
      });

      test('must supply a version number', () => {
        try {
          migrator.add({
            version: '1' as any,
            describe: 'Version 1.',
            up: async () => {},
            down: async () => {},
          });
          expect(0).toBe(1);
        } catch (e) {
          expect(e).toBeTruthy();
          expect(e).toBeInstanceOf(Error);
        }
      });

      test('version must be greater than 0', () => {
        try {
          migrator.add({
            version: 0,
            describe: 'Version 1.',
            up: async () => {},
            down: async () => {},
          });
          expect(0).toBe(1);
        } catch (e) {
          expect(e).toBeTruthy();
          expect(e).toBeInstanceOf(Error);
        }
      });
    });
  });
});
