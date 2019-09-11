// tslint:disable:no-console
// tslint:disable:no-empty

import * as fs from 'fs-extra';
import * as initCmd from '../../commands/init';

describe('UNIT - CLI/Commands', () => {
  let mockedExistsSync: any;
  let mockedMkdirSync: any;

  beforeEach(() => {
    mockedExistsSync = jest.spyOn(fs, 'existsSync');
    mockedMkdirSync = jest.spyOn(fs, 'mkdirpSync');
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('Init', () => {
    test.skip('should create both folders', async () => {
      const config = {
        migrationsDir: 'migrationsTest',
      };

      mockedExistsSync.mockImplementation((path: any) => {
        expect(path).toMatch(/(migrationsTest)/);

        return false;
      });

      mockedMkdirSync.mockImplementation((path: any) => {
        expect(path).toMatch(/(migrationsTest)/);

        return Promise.resolve();
      });

      await initCmd.action({ config });

      expect(mockedExistsSync).toHaveBeenCalledTimes(2);
      expect(mockedMkdirSync).toHaveBeenCalledTimes(2);
    });

    test.skip('should only create migrations folder', async () => {
      const config = {
        migrationsDir: 'migrationsTest',
      };

      mockedExistsSync.mockImplementation((path: any) => {
        expect(path).toMatch(/(migrationsTest)/);

        return false;
      });

      mockedMkdirSync.mockImplementation((path: any) => {
        expect(path).toMatch(/(migrationsTest)/);

        return Promise.resolve();
      });

      await initCmd.action({ config });

      expect(mockedExistsSync).toHaveBeenCalledTimes(2);
      expect(mockedMkdirSync).toHaveBeenCalledTimes(1);
    });

    test.skip('should create any folder', async () => {
      const config = {
        migrationsDir: 'migrationsTest',
      };

      mockedExistsSync.mockImplementation((path: any) => {
        expect(path).toMatch(/(migrationsTest)/);

        return true;
      });

      mockedMkdirSync.mockImplementation((path: any) => {
        expect(path).toMatch(/(backupTest)/);

        return Promise.resolve();
      });

      await initCmd.action({ config });

      expect(mockedExistsSync).toHaveBeenCalledTimes(2);
      expect(mockedMkdirSync).toHaveBeenCalledTimes(0);
    });
  });
});
