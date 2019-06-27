// tslint:disable:no-console
// tslint:disable:no-empty
import * as fs from 'fs-extra';
import 'jest-extended';
import * as utils from '../../../../lib/cli/common/utils';
import * as validation from '../../../../lib/cli/middlewares/validation';

describe('UNIT - CLI/Middlewares', () => {
  let mockedExistsSync: any;
  let mockedMkdirpSync: any;
  let mockedLogger: any;
  let mockedExit: any;

  beforeEach(() => {
    mockedExistsSync = jest.spyOn(fs, 'existsSync');
    mockedMkdirpSync = jest.spyOn(fs, 'mkdirpSync');
    mockedLogger = jest.spyOn(utils, 'logger');
    mockedExit = jest.spyOn(utils, 'exit');
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('Validation', () => {
    describe('checkNoArgPassed', () => {
      test('arguments were passed', async () => {
        mockedExit.mockImplementation(() => {
          return;
        });

        validation.checkNoArgPassed(
          {
            showHelp: () => {
              expect(1).toBe(0);
            },
          },
          {
            _: ['test'],
          },
        );

        expect(mockedExit).toHaveBeenCalledTimes(0);
      });

      test('no arguments were passed', async () => {
        mockedExit.mockImplementation(() => {
          return;
        });

        validation.checkNoArgPassed(
          {
            showHelp: () => {},
          },
          {
            _: [],
          },
        );

        expect(mockedExit).toHaveBeenCalledTimes(1);
      });
    });

    describe('checkMigrationDirExists', () => {
      test('migration directory exists', async () => {
        const config = { migrationsDir: './test' };

        mockedExistsSync.mockImplementation((path: string) => {
          expect(path).toBe(config.migrationsDir);

          return true;
        });

        validation.checkMigrationDirExists(config as any);

        expect(mockedExistsSync).toHaveBeenCalledTimes(1);
        expect(mockedLogger).toHaveBeenCalledTimes(0);
      });

      test('migration directory does not exists', async () => {
        const config = { migrationsDir: './test' };

        mockedExistsSync.mockImplementation((path: string) => {
          expect(path).toBe(config.migrationsDir);

          return false;
        });

        mockedLogger.mockImplementation((level: string, ...args: string[]) => {
          expect(level).toBe('info');
          expect(args[0]).toBe(
            'Migration directory does not exists. Please run underbase init.',
          );
        });

        validation.checkMigrationDirExists(config as any);

        expect(mockedExistsSync).toHaveBeenCalledTimes(1);
        expect(mockedLogger).toHaveBeenCalledTimes(1);
      });
    });

    describe('createbackupDir', () => {
      test('backup directory exists', async () => {
        const config = { backupsDir: './test', backup: true };

        mockedExistsSync.mockImplementation((path: string) => {
          expect(path).toBe(config.backupsDir);

          return true;
        });

        validation.createbackupDir(config as any);

        expect(mockedExistsSync).toHaveBeenCalledTimes(1);
        expect(mockedMkdirpSync).toHaveBeenCalledTimes(0);
        expect(mockedLogger).toHaveBeenCalledTimes(0);
      });

      test('backup directory does not exists', async () => {
        const config = { backupsDir: './test', backup: true };

        mockedExistsSync.mockImplementation((path: string) => {
          expect(path).toBe(config.backupsDir);

          return false;
        });

        mockedLogger.mockImplementation((level: string, ...args: string[]) => {
          expect(level).toBe('info');
          expect(args[0]).toBe('Created backup directory.');
        });

        validation.createbackupDir(config as any);

        expect(mockedExistsSync).toHaveBeenCalledTimes(1);
        expect(mockedMkdirpSync).toHaveBeenCalledTimes(1);
        expect(mockedLogger).toHaveBeenCalledTimes(1);
      });

      test('backup directory does not exists', async () => {
        const config = { backupsDir: './test', backup: false };

        mockedExistsSync.mockImplementation((path: string) => {
          expect(path).toBe(config.backupsDir);

          return false;
        });

        validation.createbackupDir(config as any);

        expect(mockedExistsSync).toHaveBeenCalledTimes(1);
        expect(mockedMkdirpSync).toHaveBeenCalledTimes(0);
        expect(mockedLogger).toHaveBeenCalledTimes(0);
      });
    });
  });
});
