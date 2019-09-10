// tslint:disable:no-console
// tslint:disable:no-empty
import * as args from '../args';

describe('UNIT - CLI/Arguments', () => {
  beforeEach(() => {});
  afterEach(() => {});

  describe('#getCommands', () => {
    test.skip('get commands', async () => {
      // TODO: mock fs & require
      const commands = await args.getCommands();

      expect(commands.length).toBe(0);
    });
  });

  describe('CLI configuration', () => {
    test('usage', async () => {
      expect(args.usage).toBe('Usage: $0 <command> [OPTIONS]');
    });

    test('usage', async () => {
      expect(args.docs).toBe(
        'Documentation: https://sundowndev.github.io/underbase/',
      );
    });

    test('options are defined', async () => {
      expect(args.options).toHaveProperty('config');
      expect(args.options).toHaveProperty('db');
      expect(args.options).toHaveProperty('migrationsDir');
      expect(args.options).toHaveProperty('collectionName');
      expect(args.options).toHaveProperty('logs');
      expect(args.options).toHaveProperty('migrationsDir');
      expect(args.options).toHaveProperty('logIfLatest');
      expect(args.options).toHaveProperty('require');
      expect(args.options).toHaveProperty('supportFile');
    });
  });
});
