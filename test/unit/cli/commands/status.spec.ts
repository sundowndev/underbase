// tslint:disable:no-console
// tslint:disable:no-empty
import 'jest-extended';
import statusCmd from '../../../../lib/cli/commands/status';
import * as utils from '../../../../lib/cli/common/utils';
import { IConfigFile } from '../../../../lib/interfaces';

describe('UNIT - CLI/Commands', () => {
  let mockedInitMigrator: any;
  let mockedLogger: any;

  beforeEach(() => {
    mockedInitMigrator = jest.spyOn(utils, 'initMigrator');
    mockedLogger = jest.spyOn(utils, 'logger');
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('Status', () => {
    test('should return status (locked)', async () => {
      const config: IConfigFile = {
        logger: () => {},
        db: 'mongodb://localhost:27017/underbase_test',
        migrationsDir: './migrations/underbase_test',
        collectionName: 'migrations',
        backupsDir: './migrations/underbase_test/backups',
        mongodumpBinary: 'mongodump',
        backup: false,
        logs: true,
      };
      const currentVersion = '1.0';
      const isLocked = true;

      mockedInitMigrator.mockImplementation((configObject: IConfigFile) => {
        expect(config).toBe(configObject);

        return Promise.resolve({
          getVersion: () => {
            return Promise.resolve(currentVersion);
          },
          isLocked: () => {
            return Promise.resolve(isLocked);
          },
        });
      });

      mockedLogger.mockImplementation((level: string, ...args: string[]) => {
        expect(level).toBe('[INFO]');
        expect(args[0]).toBeOneOf([
          `Current version is ${currentVersion}`,
          `Migration state is locked`,
        ]);
      });

      await statusCmd({ config });

      expect(mockedLogger).toHaveBeenCalledTimes(2);
    });

    test('should return status (unlocked)', async () => {
      const config: IConfigFile = {
        logger: () => {},
        db: 'mongodb://localhost:27017/underbase_test',
        migrationsDir: './migrations/underbase_test',
        collectionName: 'migrations',
        backupsDir: './migrations/underbase_test/backups',
        mongodumpBinary: 'mongodump',
        backup: false,
        logs: true,
      };
      const currentVersion = '2.1';
      const isLocked = false;

      mockedInitMigrator.mockImplementation((configObject: IConfigFile) => {
        expect(config).toBe(configObject);

        return Promise.resolve({
          getVersion: () => {
            return Promise.resolve(currentVersion);
          },
          isLocked: () => {
            return Promise.resolve(isLocked);
          },
        });
      });

      mockedLogger.mockImplementation((level: string, ...args: string[]) => {
        expect(level).toBe('[INFO]');
        expect(args[0]).toBeOneOf([
          `Current version is ${currentVersion}`,
          `Migration state is not locked`,
        ]);
      });

      await statusCmd({ config });

      expect(mockedLogger).toHaveBeenCalledTimes(2);
    });
  });
});
