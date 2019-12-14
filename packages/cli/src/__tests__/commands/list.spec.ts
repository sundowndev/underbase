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
    test.skip('should list versions', async () => {
      mockedExistsSync.mockImplementation((path: any) => {
        expect(path).toMatch(/(test1)/);

        return true;
      });

      const config = {
        migrationsDir: 'test1',
        db: '',
        logger: {
          info: () => {},
          error: () => {},
          warn: () => {},
          success: () => {},
          log: () => {},
        },
      };
      const versions = ['1.0', '1.2', '2.0'];
      const argv = {};

      await listCmd.action({ config, versions, argv });

      expect(mockedLogger).toHaveBeenCalledTimes(3);
      expect(mockedExistsSync).toHaveBeenCalledTimes(1);
    });

    test.skip('should not list versions', async () => {
      mockedExistsSync.mockImplementation((path: any) => {
        expect(path).toMatch(/(test1)/);

        return false;
      });

      const config = {
        migrationsDir: 'test1',
        db: '',
        logger: {
          info: () => {},
          error: () => {},
          warn: () => {},
          success: () => {},
          log: () => {},
        },
      };
      const versions = ['1.0', '1.2', '2.0'];
      const argv = {};

      await listCmd.action({ config, versions, argv });

      expect(mockedLogger).toHaveBeenCalledTimes(0);
      expect(mockedExistsSync).toHaveBeenCalledTimes(1);
    });
  });
});
