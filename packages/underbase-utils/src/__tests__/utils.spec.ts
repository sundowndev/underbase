// tslint:disable:no-console
// tslint:disable:no-empty
import chalk from 'chalk';
import 'jest-extended';
import * as utils from '../index';

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
            expect(args).toStrictEqual([
              chalk.inverse('INFO'),
              'test',
              'test2',
            ]);
          });

          utils.logger.info('test', 'test2');

          expect(mockedConsoleLog).toHaveBeenCalledTimes(1);
        });
      });

      describe('#warn()', () => {
        test('should log successfully', async () => {
          mockedConsoleLog.mockImplementation((...args: string[]) => {
            expect(args).toStrictEqual([
              chalk.inverse('WARN'),
              chalk.grey('test test2'),
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
              chalk.red('✗'),
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

    describe('importFile', () => {
      test('file has default export', async () => {
        const file = await utils.importFile(
          __dirname + '/__fixtures__/hasDefaultExport',
        );

        expect(file).toHaveProperty('up');
        expect(file).toHaveProperty('down');
      });

      test('file has up,down exports', async () => {
        const file = await utils.importFile(
          __dirname + '/__fixtures__/hasExports',
        );

        expect(file).toHaveProperty('up');
        expect(file).toHaveProperty('down');
      });

      test('file does not exists', async () => {
        try {
          await utils.importFile('./test');
          expect(0).toBe(1);
        } catch (e) {
          expect(e).toBeTruthy();
          expect(e).toBeInstanceOf(Error);
        }
      });

      test('migration object is not valid', async () => {
        try {
          await utils.importFile(__dirname + '/__fixtures__/notValidExports');
          expect(0).toBe(1);
        } catch (e) {
          expect(e).toBeTruthy();
          expect(e).toBeInstanceOf(Error);
        }
      });
    });
  });
});
