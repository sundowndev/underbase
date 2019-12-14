// tslint:disable:no-console
// tslint:disable:no-empty

jest.mock('fs');
jest.mock('path');

import * as fs from 'fs';
import * as path from 'path';
import { docs, getCommands, options, usage } from '../args';

describe('packages/cli/src/args.ts', () => {
  beforeEach(() => {});

  afterEach(() => {
    jest.restoreAllMocks();
    jest.resetAllMocks();
  });

  describe('#getCommands', () => {
    test('get commands', async () => {
      const commandsPath = __dirname.replace('__tests__', 'commands');

      jest
        .spyOn(fs, 'readdirSync')
        .mockReturnValueOnce(['index.js', 'test.ts'] as any);

      jest
        .spyOn(path, 'join')
        .mockReturnValueOnce(commandsPath)
        .mockReturnValueOnce(__dirname + '/__mocks__/cmd.ts');

      const commands = await getCommands();

      expect(commands).toMatchObject([
        {
          command: 'test',
          name: 'test',
        },
      ]);

      expect(fs.readdirSync).toBeCalledTimes(1);
      expect(fs.readdirSync).toBeCalledWith(commandsPath);

      expect(path.join).toBeCalledTimes(2);
      expect(path.join).nthCalledWith(
        1,
        __dirname.replace('/__tests__', ''),
        'commands',
      );
      expect(path.join).nthCalledWith(
        2,
        __dirname.replace('/__tests__', ''),
        'commands',
        'index.js',
      );
    });
  });

  describe('CLI configuration', () => {
    test('usage', async () => {
      expect(usage).toBe('Usage: $0 <command> [OPTIONS]');
    });

    test('usage', async () => {
      expect(docs).toBe(
        'Documentation: https://sundowndev.github.io/underbase/',
      );
    });

    test('options are defined', async () => {
      expect(options).toHaveProperty('config');
      expect(options).toHaveProperty('db');
      expect(options).toHaveProperty('migrationsDir');
      expect(options).toHaveProperty('collectionName');
      expect(options).toHaveProperty('logs');
      expect(options).toHaveProperty('migrationsDir');
      expect(options).toHaveProperty('logIfLatest');
      expect(options).toHaveProperty('supportFile');
    });
  });
});
