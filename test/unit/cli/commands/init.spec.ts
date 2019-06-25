// tslint:disable:no-console
// tslint:disable:no-empty

import * as fs from 'fs-extra';
import initCmd from '../../../../lib/cli/commands/init';

describe('UNIT - CLI/Commands', () => {
  let mockedExistsSync: any;
  let mockedMkdirSync: any;

  beforeEach(() => {
    mockedExistsSync = jest.spyOn(fs, 'existsSync');
    mockedMkdirSync = jest.spyOn(fs, 'mkdirpSync');
  });

  afterEach(() => {
    mockedExistsSync.mockRestore();
    mockedMkdirSync.mockRestore();
  });

  describe('Init', () => {
    test('should create both folders', async () => {
      const config = {
        migrationsDir: 'migrationsTest',
        backupsDir: 'backupTest',
        backup: true,
      };

      mockedExistsSync.mockImplementation((path: any) => {
        expect(path).toMatch(/(migrationsTest|backupTest)/);

        return false;
      });

      mockedMkdirSync.mockImplementation((path: any) => {
        expect(path).toMatch(/(migrationsTest|backupTest)/);

        return Promise.resolve();
      });

      await initCmd({ config });

      expect(mockedExistsSync).toHaveBeenCalledTimes(2);
      expect(mockedMkdirSync).toHaveBeenCalledTimes(2);
    });

    test('should only create migrations folder', async () => {
      const config = {
        migrationsDir: 'migrationsTest',
        backupsDir: 'backupTest',
        backup: false,
      };

      mockedExistsSync.mockImplementation((path: any) => {
        expect(path).toMatch(/(migrationsTest|backupTest)/);

        return false;
      });

      mockedMkdirSync.mockImplementation((path: any) => {
        expect(path).toMatch(/(migrationsTest)/);

        return Promise.resolve();
      });

      await initCmd({ config });

      expect(mockedExistsSync).toHaveBeenCalledTimes(2);
      expect(mockedMkdirSync).toHaveBeenCalledTimes(1);
    });

    test('should only create backup folder', async () => {
      const config = {
        migrationsDir: 'migrationsTest',
        backupsDir: 'backupTest',
        backup: true,
      };

      mockedExistsSync.mockImplementation((path: any) => {
        expect(path).toMatch(/(migrationsTest|backupTest)/);

        return path === 'backupTest' ? false : true;
      });

      mockedMkdirSync.mockImplementation((path: any) => {
        expect(path).toMatch(/(backupTest)/);

        return Promise.resolve();
      });

      await initCmd({ config });

      expect(mockedExistsSync).toHaveBeenCalledTimes(2);
      expect(mockedMkdirSync).toHaveBeenCalledTimes(1);
    });

    test('should create any folder', async () => {
      const config = {
        migrationsDir: 'migrationsTest',
        backupsDir: 'backupTest',
        backup: false,
      };

      mockedExistsSync.mockImplementation((path: any) => {
        expect(path).toMatch(/(migrationsTest|backupTest)/);

        return path === 'backupTest' ? false : true;
      });

      mockedMkdirSync.mockImplementation((path: any) => {
        expect(path).toMatch(/(backupTest)/);

        return Promise.resolve();
      });

      await initCmd({ config });

      expect(mockedExistsSync).toHaveBeenCalledTimes(2);
      expect(mockedMkdirSync).toHaveBeenCalledTimes(0);
    });
  });
});
