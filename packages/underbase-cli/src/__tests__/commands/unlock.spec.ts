// tslint:disable:no-console
// tslint:disable:no-empty
import { IConfigFile } from '@underbase/types';
import * as utils from '@underbase/utils';
import 'jest-extended';
import * as unlockCmd from '../../commands/unlock';

describe('UNIT - CLI/Commands', () => {
  let mockedInitMigrator: any;
  let mockedLogger: any;
  let mockedTimer: any;

  beforeEach(() => {
    mockedInitMigrator = jest.spyOn(utils, 'initMigrator');
    mockedLogger = jest.spyOn(utils.logger, 'info');
    mockedTimer = jest.spyOn(utils, 'timer');
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('Unlock', () => {
    test('should unlock state', async () => {
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

      mockedInitMigrator.mockImplementation((configObject: IConfigFile) => {
        expect(config).toBe(configObject);

        return Promise.resolve({
          unlock: () => {
            return Promise.resolve();
          },
          isLocked: () => {
            return Promise.resolve(true);
          },
        });
      });

      mockedTimer.mockImplementation(() => {
        return { spent: () => '5' };
      });

      await unlockCmd.action({ config });

      expect(mockedInitMigrator).toHaveBeenCalledTimes(1);
      expect(mockedLogger).toHaveBeenCalledTimes(2);
    });

    test('state already unlocked', async () => {
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

      mockedInitMigrator.mockImplementation((configObject: IConfigFile) => {
        expect(config).toBe(configObject);

        return Promise.resolve({
          unlock: () => {
            return Promise.resolve();
          },
          isLocked: () => {
            return Promise.resolve(false);
          },
        });
      });

      await unlockCmd.action({ config });

      expect(mockedInitMigrator).toHaveBeenCalledTimes(1);
      expect(mockedLogger).toHaveBeenCalledTimes(1);
    });
  });
});
