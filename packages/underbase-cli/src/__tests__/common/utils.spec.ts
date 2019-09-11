// tslint:disable:no-console
// tslint:disable:no-empty
import { Migration } from '@underbase/core';
import { IConfigFile } from '@underbase/types';
// Import * as utils from '@underbase/utils';
import 'jest-extended';
import * as common from '../../common/utils';

const dbURL = process.env.DBURL || 'mongodb://localhost:27017/underbase_test';

describe('UNIT - CLI/Common', () => {
  beforeEach(() => {});

  afterEach(() => {});

  // TODO: mock migrator
  describe('#initMigrator', () => {
    test('should init migrator', async () => {
      const config: IConfigFile = {
        logs: true,
        logIfLatest: true,
        db: dbURL,
        logger: {
          info: () => {},
          error: () => {},
          warn: () => {},
          success: () => {},
          log: () => {},
        },
      };

      const migrator = await common.initMigrator(config);

      expect(migrator).toBeInstanceOf(Migration);
    });
  });
});
