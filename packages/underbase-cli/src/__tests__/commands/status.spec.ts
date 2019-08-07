// tslint:disable:no-console
// tslint:disable:no-empty
import { IConfigFile } from '@underbase/types';
import * as utils from '@underbase/utils';
import 'jest-extended';
import * as statusCmd from '../../commands/status';
import * as cliUtils from '../../common/utils';

describe('UNIT - CLI/Commands', () => {
  let mockedInitMigrator: any;
  let mockedLogger: any;

  beforeEach(() => {
    mockedInitMigrator = jest.spyOn(cliUtils, 'initMigrator');
    mockedLogger = jest.spyOn(utils.logger, 'info');
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

      await statusCmd.action({ config });

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

      await statusCmd.action({ config });

      expect(mockedLogger).toHaveBeenCalledTimes(2);
    });
  });
});
