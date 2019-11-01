// tslint:disable:no-console
// tslint:disable:no-empty
import { IConfigFile } from '@underbase/types';
import * as utils from '@underbase/utils';
import 'jest-extended';
import * as migrateCmd from '../../commands/migrate';
import * as cliUtils from '../../common/utils';

describe('UNIT - CLI/Commands', () => {
  let mockedInitMigrator: any;
  let mockedExit: any;
  let mockedImportFile: any;

  beforeEach(() => {
    mockedInitMigrator = jest.spyOn(cliUtils, 'initMigrator');
    mockedExit = jest.spyOn(utils, 'exit');
    mockedImportFile = jest.spyOn(utils, 'importFile');
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('Migrate', () => {
    test('this version does not exists', async () => {
      const config: IConfigFile = {
        db: '',
        logs: false,
        logger: {
          info: () => {},
          error: () => {},
          warn: () => {},
          success: () => {},
          log: () => {},
        },
      };
      const versions = ['1.0', '1.2'];
      const argv = { migration: '3.0' };

      mockedExit.mockImplementation(() => {
        return;
      });

      await migrateCmd.action({ config, versions, argv });

      expect(mockedExit).toHaveBeenCalledTimes(1);
    });

    test('should import then run migrations', async () => {
      jest
        .spyOn(cliUtils, 'getMigrationsEntryFiles')
        .mockImplementation((): any => {
          return ['/test/1.0/index.js', '/test/1.2/index.js'];
        });

      const config: IConfigFile = {
        db: '',
        logs: false,
        logger: {
          info: () => {},
          error: () => {},
          warn: () => {},
          success: () => {},
          log: () => {},
        },
        migrationsDir: './test',
      };
      const versions = ['1.0', '1.2'];
      const argv = { migration: '1.0' };

      mockedInitMigrator.mockImplementation((configObject: IConfigFile) => {
        expect(config).toBe(configObject);

        return Promise.resolve({
          add: (migration: any) => {
            expect(migration).toContainKeys([
              'version',
              'describe',
              'up',
              'down',
            ]);

            return Promise.resolve();
          },
          getVersion: () => {
            expect(1).toBe(0);
            return Promise.resolve(0);
          },
          migrateTo: (version: string) => {
            expect(version).toBe('1.0');

            return Promise.resolve();
          },
        });
      });

      mockedImportFile.mockImplementation((path: string) => {
        expect(path).toBeOneOf(['/test/1.0/index.js', '/test/1.2/index.js']);

        return Promise.resolve({
          version: 1,
          describe: 'test',
          up: () => {},
          down: () => {},
        });
      });

      await migrateCmd.action({ config, versions, argv });
    });

    test.skip('should catch error while running migration', async () => {});

    test.skip('should catch error while importing migration', async () => {
      const config: IConfigFile = {
        db: '',
        logs: false,
        logger: {
          info: () => {},
          error: () => {},
          warn: () => {},
          success: () => {},
          log: () => {},
        },
        migrationsDir: './test',
      };
      const versions = ['1.0', '1.2'];
      const argv = { migration: '1.0' };

      mockedInitMigrator.mockImplementation((configObject: IConfigFile) => {
        expect(config).toBe(configObject);

        return Promise.resolve({
          add: (migration: any) => {
            expect(migration).toContainKeys([
              'version',
              'describe',
              'up',
              'down',
            ]);

            return Promise.resolve();
          },
          getVersion: () => {
            return Promise.resolve(0);
          },
          migrateTo: (version: string) => {
            expect(version).toBe('1.0');

            return Promise.resolve();
          },
        });
      });

      mockedImportFile.mockImplementation((path: string) => {
        expect(path).toBeOneOf([
          `${config.migrationsDir}/1.0`,
          `${config.migrationsDir}/1.2`,
        ]);

        throw new Error('test');
      });

      try {
        await migrateCmd.action({ config, versions, argv });
      } catch (e) {
        expect(e).toEqual({
          error: 'User with 1 not found.',
        });
      }

      expect(mockedImportFile).toReject();
    });
  });
});
