// Commands
import * as unlock from './commands/force-unlock';
import * as init from './commands/init';
import * as list from './commands/list';
import * as migrate from './commands/migrate';
import * as rerun from './commands/rerun';
import * as status from './commands/status';

export const usage = 'Usage: $0 <command> [OPTIONS]';
export const docs = 'Documentation: https://sundowndev.github.io/underbase/';

export const commands: any = {
  init,
  list,
  migrate,
  status,
  unlock,
  rerun,
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
  supportFile: {
    default: undefined,
    description: 'Support file path.',
    type: 'string' as 'string',
  },
};
