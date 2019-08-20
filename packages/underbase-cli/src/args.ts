// Commands
import * as initCmd from './commands/init';
import * as listCmd from './commands/list';
import * as migrateCmd from './commands/migrate';
import * as rerunCmd from './commands/rerun';
import * as statusCmd from './commands/status';
import * as unlockCmd from './commands/unlock';

export const usage = 'Usage: $0 <command> [OPTIONS]';
export const docs = 'Documentation: https://sundowndev.github.io/underbase/';

export const commands: any = {
  init: initCmd,
  list: listCmd,
  migrate: migrateCmd,
  status: statusCmd,
  unlock: unlockCmd,
  rerun: rerunCmd,
};

export const options = {
  config: {
    default: 'underbase.config.js',
    description: 'Configuration file path.',
    type: 'string' as 'string',
  },
  db: {
    default: '',
    description: 'MongoDB connection URL.',
    type: 'string' as 'string',
  },
  migrationsDir: {
    default: './migrations',
    description: 'Migrations versions directory.',
    type: 'string' as 'string',
  },
  collectionName: {
    default: 'migrations',
    description: 'Migrations state collection.',
    type: 'string' as 'string',
  },
  logs: {
    default: true,
    description: 'Enable logs.',
    type: 'boolean' as 'boolean',
  },
  compiler: {
    default: undefined,
    description: 'Use a compiler register to fetch migration files.',
    type: 'string' as 'string',
    choices: ['babel-register', 'ts-node'],
  },
};
