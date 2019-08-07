// tslint:disable:no-console
// tslint:disable:no-empty
import { Migration } from '@underbase/core';
import * as utils from '@underbase/utils';
import chalk from 'chalk';
import 'jest-extended';

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
          .spyOn(Migration.prototype, 'config')
          .mockImplementation((configObject: any) => {
            expect(configObject).toBe(config);

            return Promise.resolve();
          });

        await utils.initMigrator(config as any);
      });
    });

    describe('logger', () => {
      describe('#log()', () => {
        test('should log successfully', async () => {
          mockedConsoleLog.mockImplementation((...args: string[]) => {
            expect(args).toStrictEqual(['test', 'test2']);
          });

          utils.logger.log('test', 'test2');

          expect(mockedConsoleLog).toHaveBeenCalledTimes(1);
        });
      });

      describe('#info()', () => {
        test('should log successfully', async () => {
          mockedConsoleLog.mockImplementation((...args: string[]) => {
            expect(args).toStrictEqual([chalk.bold('[INFO]'), 'test', 'test2']);
          });

          utils.logger.info('test', 'test2');

          expect(mockedConsoleLog).toHaveBeenCalledTimes(1);
        });
      });

      describe('#warn()', () => {
        test('should log successfully', async () => {
          mockedConsoleLog.mockImplementation((...args: string[]) => {
            expect(args).toStrictEqual([
              chalk.bold('[WARNING]'),
              'test',
              'test2',
            ]);
          });

          utils.logger.warn('test', 'test2');

          expect(mockedConsoleLog).toHaveBeenCalledTimes(1);
        });
      });

      describe('#error()', () => {
        test('should log successfully', async () => {
          mockedConsoleLog.mockImplementation((...args: string[]) => {
            expect(args).toStrictEqual([
              chalk.bgRed('ERROR'),
              chalk.red('test test2'),
            ]);
          });

          utils.logger.error('test', 'test2');

          expect(mockedConsoleLog).toHaveBeenCalledTimes(1);
        });
      });

      describe('#success()', () => {
        test('should log successfully', async () => {
          mockedConsoleLog.mockImplementation((...args: string[]) => {
            expect(args).toStrictEqual([chalk.green('✔ test test2')]);
          });

          utils.logger.success('test', 'test2');

          expect(mockedConsoleLog).toHaveBeenCalledTimes(1);
        });
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
