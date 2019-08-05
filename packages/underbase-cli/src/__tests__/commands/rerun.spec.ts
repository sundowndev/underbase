// tslint:disable:no-console
// tslint:disable:no-empty
import 'jest-extended';
import { IConfigFile, IMigration } from 'underbase/src/interfaces';
import * as rerunCmd from '../../commands/rerun';
import * as backup from '../../common/backup';
import * as utils from '../../common/utils';

describe('UNIT - CLI/Commands', () => {
  let mockedInitMigrator: any;
  let mockedExit: any;
  let mockedImportFile: any;
  let mockedBackup: any;

  beforeEach(() => {
    mockedInitMigrator = jest.spyOn(utils, 'initMigrator');
    mockedExit = jest.spyOn(utils, 'exit');
    mockedImportFile = jest.spyOn(utils, 'importFile');
    mockedBackup = jest.spyOn(backup, 'create');
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('Rerun', () => {
    test('should rerun current version', async () => {
      const config: IConfigFile = {
        db: '',
        logs: false,
        logger: () => {},
        mongodumpBinary: '',
        backup: false,
      };
      const versions = ['1.0', '1.2'];

      mockedExit.mockImplementation(() => {
        return;
      });

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
            // Expect(1).toBe(0);
            return Promise.resolve(1.2);
          },
          migrateTo: (version: string) => {
            expect(version).toBe('1.2,rerun');

            return Promise.resolve();
          },
        });
      });

      mockedImportFile.mockImplementation((path: string) => {
        expect(path).toBeOneOf([
          `${config.migrationsDir}/1.0`,
          `${config.migrationsDir}/1.2`,
        ]);

        return Promise.resolve({
          version: 1,
          describe: 'test',
          up: () => {},
          down: () => {},
        });
      });

      await rerunCmd.action({ config, versions });

      expect(mockedInitMigrator).toHaveBeenCalledTimes(1);
      expect(mockedImportFile).toHaveBeenCalledTimes(2);
      expect(mockedExit).toHaveBeenCalledTimes(0);
    });

    test('should create backup then rerun current version', async () => {
      const config: IConfigFile = {
        db: '',
        logs: false,
        logger: () => {},
        mongodumpBinary: '',
        migrationsDir: './test',
        backup: true,
        backupsDir: './backup',
      };
      const versions = ['1.0', '1.2'];

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
            return Promise.resolve(1.2);
          },
          migrateTo: (version: string) => {
            expect(version).toBe('1.2,rerun');

            return Promise.resolve();
          },
        });
      });

      mockedImportFile.mockImplementation((path: string) => {
        expect(path).toBeOneOf([
          `${config.migrationsDir}/1.0`,
          `${config.migrationsDir}/1.2`,
        ]);

        return Promise.resolve({
          version: 1,
          describe: 'test',
          up: () => {},
          down: () => {},
        });
      });

      mockedBackup.mockImplementation(
        (configObject: IConfigFile, currentVersion: number) => {
          expect(configObject).toBe(config);
          expect(currentVersion).toBe(1.2);

          return Promise.resolve();
        },
      );

      await rerunCmd.action({ config, versions });

      expect(mockedBackup).toHaveBeenCalledTimes(1);
    });
  });
});
