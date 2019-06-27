// tslint:disable:no-console
// tslint:disable:no-empty
import 'jest-extended';
import * as utils from '../../../../lib/cli/common/utils';
import { Migration } from '../../../../lib/migration';

describe('UNIT - CLI/Common', () => {
  let mockedProcessExit: any;
  let mockedConsoleLog: any;

  beforeEach(() => {
    mockedProcessExit = jest.spyOn(process, 'exit');
    mockedConsoleLog = jest.spyOn(console, 'log');
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('Utils', () => {
    describe('initMigrator', () => {
      test('should init migrator config', async () => {
        const config = {};

        jest
          .spyOn(utils, 'logger')
          .mockImplementation((level: string, ...args: string[]) => {});

        jest
          .spyOn(Migration.prototype, 'config')
          .mockImplementation((configObject: any) => {
            expect(configObject).toBe(config);

            return Promise.resolve();
          });

        await utils.initMigrator(config as any);
      });
    });

    describe('logger', () => {
      test('should only print level', async () => {
        mockedConsoleLog.mockImplementation((...args: string[]) => {
          expect(args).toStrictEqual(['test']);
        });

        utils.logger('test');

        expect(mockedConsoleLog).toHaveBeenCalledTimes(1);
      });

      test('should print both level and message', async () => {
        mockedConsoleLog.mockImplementation((...args: string[]) => {
          expect(args).toStrictEqual(['[TEST]', 'message']);
        });

        utils.logger('test', 'message');

        expect(mockedConsoleLog).toHaveBeenCalledTimes(1);
      });
    });

    describe('timer', () => {
      test('should return spent time', async () => {
        jest.spyOn(Date.prototype, 'getTime').mockImplementation(() => {
          return 2;
        });

        const t = utils.timer();

        expect(t.spent()).toBe(0);
      });
    });

    describe('exit', () => {
      test('should exit', async () => {
        mockedProcessExit.mockImplementation(() => {
          return;
        });

        utils.exit();

        expect(mockedProcessExit).toHaveBeenCalledTimes(1);
      });
    });

    describe.skip('importFile', () => {
      test('import specified file', async () => {
        jest.spyOn(module, 'require');

        const file = await utils.importFile('./test');
      });
    });
  });
});
