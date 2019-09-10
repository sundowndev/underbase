// tslint:disable:no-console
// tslint:disable:no-empty
import * as utils from '@underbase/utils';
import * as fs from 'fs-extra';
import 'jest-extended';
import * as validation from '../../middlewares/validators';

describe('UNIT - CLI/Middlewares', () => {
  let mockedExistsSync: any;
  let mockedLogger: any;

  beforeEach(() => {
    mockedExistsSync = jest.spyOn(fs, 'existsSync');
    mockedLogger = jest.spyOn(utils.logger, 'info');
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('Validation', () => {
    describe('checkMigrationDirExists', () => {
      test.skip('migration directory exists', async () => {
        const config = { migrationsDir: './test' };

        mockedExistsSync.mockImplementation((path: string) => {
          expect(path).toBe(config.migrationsDir);

          return true;
        });

        validation.checkMigrationDirExists(config as any);

        expect(mockedExistsSync).toHaveBeenCalledTimes(1);
        expect(mockedLogger).toHaveBeenCalledTimes(0);
      });

      test.skip('migration directory does not exists', async () => {
        const config = { migrationsDir: './test' };

        mockedExistsSync.mockImplementation((path: string) => {
          expect(path).toBe(config.migrationsDir);

          return false;
        });

        validation.checkMigrationDirExists(config as any);

        expect(mockedExistsSync).toHaveBeenCalledTimes(1);
      });
    });
  });
});
