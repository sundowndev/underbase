// tslint:disable:no-console
// tslint:disable:no-empty

import * as utils from '@underbase/utils';
import * as fs from 'fs-extra';
import * as listCmd from '../../commands/list';

describe('UNIT - CLI/Commands', () => {
  let mockedExistsSync: any;
  let mockedLogger: any;

  beforeEach(() => {
    mockedExistsSync = jest.spyOn(fs, 'existsSync');
    mockedLogger = jest.spyOn(utils.logger, 'log');
  });

  afterEach(() => {
    jest.restoreAllMocks();
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

      await listCmd.action({ config, versions });

      expect(mockedLogger).toHaveBeenCalledTimes(3);
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

      await listCmd.action({ config, versions });

      expect(mockedLogger).toHaveBeenCalledTimes(0);
      expect(mockedExistsSync).toHaveBeenCalledTimes(1);
    });
  });
});
