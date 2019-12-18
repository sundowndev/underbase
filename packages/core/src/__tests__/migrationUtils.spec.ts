// tslint:disable:no-console
// tslint:disable:no-empty
import { EDirection, ILogger, IMigration } from '@underbase/types';
import chalk from 'chalk';
import { MigrationUtils } from '../classes/MigrationUtils';

describe('packages/core/src/MigrationUtils.ts - MigrationUtils', () => {
  const loggerMock: ILogger = {
    log: jest.fn(),
    info: jest.fn(),
    warn: jest.fn(),
    success: jest.fn(),
    error: jest.fn(),
  };

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('#loggerHelper', () => {
    it('should log to console', () => {
      const helper = new MigrationUtils(
        EDirection.up,
        null as any,
        loggerMock as any,
      );

      // tslint:disable-next-line: no-string-literal
      helper['loggerHelper'](loggerMock)('test');

      expect(loggerMock.log).toBeCalledTimes(1);
      expect(loggerMock.log).toBeCalledWith(
        ' '.repeat(8),
        chalk.inverse(' LOGGER '),
        'test',
      );
    });
  });

  describe('#migrate', () => {
    it('should execute migration with a warning about promises', async () => {
      const utils = new MigrationUtils(
        EDirection.up,
        null as any,
        loggerMock as any,
      );

      const actionMock = jest.fn().mockResolvedValue(null);
      const migration: IMigration = {
        version: 1.0,
        up: actionMock,
        down: () => {},
      };

      await utils.utils.Migrate([migration]);

      expect(actionMock).toBeCalledTimes(1);
      expect(actionMock).toBeCalledWith(utils.utils);

      expect(loggerMock.warn).toBeCalledTimes(1);
      expect(loggerMock.warn).toBeCalledWith(
        'One of the up functions is nor Async or Promise',
        '(not described)',
      );

      expect(loggerMock.log).toBeCalledTimes(0);
    });

    it('should execute migration without warning ', async () => {
      const utils = new MigrationUtils(
        EDirection.down,
        null as any,
        loggerMock as any,
      );

      const actionMock = async () => {};
      const migration: IMigration = {
        version: 1.0,
        up: () => {},
        down: actionMock,
      };

      await utils.utils.Migrate([migration]);

      expect(loggerMock.warn).toBeCalledTimes(0);
      expect(loggerMock.log).toBeCalledTimes(0);
    });

    it('should execute migration with describe ', async () => {
      const utils = new MigrationUtils(
        EDirection.up,
        null as any,
        loggerMock as any,
      );

      const actionMock = async () => {};
      const migration: IMigration = {
        version: 1.0,
        describe: 'test',
        up: actionMock,
        down: () => {},
      };

      await utils.utils.Migrate([migration]);

      expect(loggerMock.warn).toBeCalledTimes(0);

      expect(loggerMock.log).toBeCalledTimes(1);
      expect(loggerMock.log).toBeCalledWith(' '.repeat(8), chalk.grey('test'));
    });

    it('should throw error on rejection', async () => {
      const utils = new MigrationUtils(
        EDirection.down,
        null as any,
        loggerMock as any,
      );

      const actionMock = jest.fn().mockRejectedValue('test');
      const migration: IMigration = {
        version: 1.0,
        up: () => {},
        down: actionMock,
      };

      let err: any;

      try {
        await utils.utils.Migrate([migration]);
      } catch (e) {
        err = e;
      }

      expect(err).toStrictEqual(new Error('test'));

      expect(actionMock).toBeCalledTimes(1);
      expect(actionMock).toBeCalledWith(utils.utils);

      expect(loggerMock.log).toBeCalledTimes(0);
    });
  });
});
