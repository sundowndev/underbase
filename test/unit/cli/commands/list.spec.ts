// tslint:disable:no-console
// tslint:disable:no-empty

import * as fs from 'fs-extra';
import listCmd from '../../../../lib/cli/commands/list';
import * as utils from '../../../../lib/cli/common/utils';

describe('UNIT - CLI/Commands', () => {
  let mockedExistsSync: any;
  let mockedMkdirSync: any;
  let mockedLogger: any;

  beforeEach(() => {
    mockedExistsSync = jest.spyOn(fs, 'existsSync');
    mockedMkdirSync = jest.spyOn(fs, 'mkdirpSync');
    mockedLogger = jest.spyOn(utils, 'logger');
  });

  afterEach(() => {
    mockedExistsSync.mockRestore();
    mockedMkdirSync.mockRestore();
    mockedLogger.mockRestore();
  });

  describe('List', () => {
    test('should list versions', async () => {
      mockedExistsSync.mockImplementation((path: any) => {
        expect(path).toMatch(/(test1)/);

        return true;
      });

      const config = {
        migrationsDir: 'test1',
      };
      const versions = ['1.0', '1.2', '2.0'];

      await listCmd({ config, versions });

      expect(mockedLogger).toHaveBeenCalledTimes(4);
      expect(mockedExistsSync).toHaveBeenCalledTimes(1);
    });

    test('should not list versions', async () => {
      mockedExistsSync.mockImplementation((path: any) => {
        expect(path).toMatch(/(test1)/);

        return false;
      });

      const config = {
        migrationsDir: 'test1',
      };
      const versions = ['1.0', '1.2', '2.0'];

      await listCmd({ config, versions });

      expect(mockedLogger).toHaveBeenCalledTimes(0);
      expect(mockedExistsSync).toHaveBeenCalledTimes(1);
    });
  });
});
