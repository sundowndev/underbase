// tslint:disable:no-console
// tslint:disable:no-empty
import * as child_process from 'child_process';
import 'jest-extended';
import * as backup from '../../../../lib/cli/common/backup';
import * as utils from '../../../../lib/cli/common/utils';
import { IConfigFile } from '../../../../lib/interfaces';

describe('UNIT - CLI/Common', () => {
  let mockedLogger: any;
  let mockedExec: any;
  let mockedProcessExit: any;
  let mockedConsoleError: any;

  beforeEach(() => {
    mockedLogger = jest.spyOn(utils, 'logger');
    mockedExec = jest.spyOn(child_process, 'exec');
    mockedProcessExit = jest.spyOn(process, 'exit');
    mockedConsoleError = jest.spyOn(console, 'error');
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('Backup', () => {
    describe('create()', () => {
      test('should create backup', async () => {
        const config: IConfigFile = {
          mongodumpBinary: 'mongodump_test',
          backupsDir: './test/backup',
          db: 'mongodb://localhost:27017/test',
          logs: false,
          logger: '',
        };
        const version = 1.0;

        mockedExec.mockImplementation((cmd: string, cb: any) => {
          expect(cmd).toMatch(
            // tslint:disable-next-line: ter-max-len
            /(mongodump_test --host localhost:27017 --archive=.\/test\/backup\/1.0_(.*).gz --gzip --db test)/,
          );

          return cb();
        });

        await backup.create(config, version);

        expect(mockedExec).toHaveBeenCalledTimes(1);
        expect(mockedLogger).toHaveBeenCalledTimes(2);
      });

      test('should create backup', async () => {
        const config: IConfigFile = {
          mongodumpBinary: 'mongodump',
          backupsDir: './test/backup',
          db: 'localhost:27017/test2',
          logs: false,
          logger: '',
        };
        const version = 1.0;

        mockedExec.mockImplementation((cmd: string, cb: any) => {
          expect(cmd).toMatch(
            // tslint:disable-next-line: ter-max-len
            /(mongodump --host localhost:27017 --archive=.\/test\/backup\/1.0_(.*).gz --gzip --db test2)/,
          );

          return cb();
        });

        await backup.create(config, version);

        expect(mockedExec).toHaveBeenCalledTimes(1);
        expect(mockedLogger).toHaveBeenCalledTimes(2);
      });

      test('should handle process error', async () => {
        const config: IConfigFile = {
          mongodumpBinary: 'mongodump',
          backupsDir: './test/backup',
          db: 'localhost:27017/test2',
          logs: false,
          logger: '',
        };
        const version = 1.0;

        mockedLogger.mockImplementation((level: string, ...args: string[]) => {
          expect(args[0]).toBeString();
        });

        mockedExec.mockImplementation((cmd: string, cb: any) => {
          expect(cmd).toMatch(
            // tslint:disable-next-line: ter-max-len
            /(mongodump --host localhost:27017 --archive=.\/test\/backup\/1.0_(.*).gz --gzip --db test2)/,
          );

          return cb('error');
        });

        mockedProcessExit.mockImplementation(() => {
          return;
        });

        mockedConsoleError.mockImplementation((...args: string[]) => {
          expect(args[0]).toBe('error');
        });

        await backup.create(config, version);

        expect(mockedLogger).toHaveBeenCalledTimes(3);
        expect(mockedExec).toHaveBeenCalledTimes(1);
        expect(mockedConsoleError).toHaveBeenCalledTimes(1);
        expect(mockedProcessExit).toHaveBeenCalledTimes(1);
      });
    });
  });
});
