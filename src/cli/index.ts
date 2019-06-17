// tslint:disable:no-var-requires
// tslint:disable:no-console
import * as fs from 'fs-extra';
import * as path from 'path';
import * as yargs from 'yargs';
import { migrator } from '../index';
import { IConfigFile } from './common/interfaces';
import { exit, logger } from './common/utils';

// Middlewares
import * as validation from './middlewares/validation';

// Commands
import initCmd from './commands/init';
import listCmd from './commands/list';
import migrateCmd from './commands/migrate';
import statusCmd from './commands/status';
import unlockCmd from './commands/unlock';

// Enable ES6 module for migrations files
require = require('esm')(module);

const commands = {
  migrate: {
    describe: 'Initiate migration environment',
    callback: migrateCmd,
  },
  init: {
    describe: 'Initiate migration environment',
    callback: initCmd,
  },
  list: {
    describe: 'Show available migrations versions',
    callback: listCmd,
  },
  status: {
    describe: 'Show migrations status',
    callback: statusCmd,
  },
  unlock: {
    describe: 'Unlock migrations state',
    callback: unlockCmd,
  },
};

const argv = yargs
  .scriptName('underbase')
  .usage('Usage: $0 <command> [OPTIONS]')
  .command('migrate <migration>', commands['migrate'].describe)
  .command('init', commands['init'].describe)
  .command('list', commands['list'].describe)
  .command('status', commands['status'].describe)
  .command('unlock', commands['unlock'].describe)
  .describe('config <path>', 'JSON configuration file path')
  .describe('db <url>', 'MongoDB connection URL')
  .describe('migrations-dir <path>', 'Migrations versions directory')
  .describe('backup', 'Enable automatic backups')
  .describe('backups-dir <path>', 'Backups directory')
  .describe('collection-name <name>', 'Migrations state collection')
  .describe('logs', 'Enable logs')
  .describe('rerun', 'Force migrations execution')
  .describe('chdir <path>', 'Change the working directory')
  .describe('version', 'Show package version')
  .describe(
    'mongodumpBinary <path>',
    'Binary file for mongodump (it can be a docker exec command)',
  )
  .help('h', 'Show this help message')
  .alias('h', 'help')
  .locale('en_US')
  .parse();

let configFile = {} as IConfigFile;
const workingDirectory =
  (argv.chdir as string) || (configFile.chdir as string) || process.cwd();

if (argv.config) {
  configFile = require(path.resolve(argv.config as string));
}

const config = {
  workingDirectory,
  // False disables logging
  logs: (argv.logs as boolean) || (configFile.logs as boolean) || true,
  // Null or a function
  logger: logger as any,
  // Enable/disable info log "already at latest."
  logIfLatest: true,
  // Migrations collection name. Defaults to 'migrations'
  collectionName:
    (argv.collectionName as string) ||
    (configFile.collectionName as string) ||
    'migrations',
  // MongDB url
  db: (argv.db as string) || (configFile.db as string) || null,
  // Enable automatic backups
  backup: (argv.backup as boolean) || (configFile.backup as boolean) || false,
  // Directory to save backups
  backupsDir: path.resolve(
    path.join(
      workingDirectory,
      (argv.backupsDir as string) ||
        (configFile.backupsDir as string) ||
        './migrations/backups',
    ),
  ),
  migrationsDir: path.resolve(
    path.join(
      workingDirectory,
      (argv.migrationsDir as string) ||
        (configFile.migrationsDir as string) ||
        './migrations',
    ),
  ),
  mongodumpBinary:
    (argv.mongodumpBinary as string) ||
    (configFile.mongodumpBinary as string) ||
    'mongodump',
} as IConfigFile;

async function main() {
  validation.checkNoArgPassed(argv);
  validation.checkMigrationDirExists(config);
  validation.createbackupDir(config);

  const versions = fs.existsSync(config.migrationsDir)
    ? (fs
        .readdirSync(config.migrationsDir)
        .filter((v: string) => v.match(new RegExp(/^[\d].[\d]$/))) as string[])
    : [];

  if (Object.keys(commands).indexOf(argv._[0]) > -1) {
    await commands[argv._[0]].callback({
      config,
      versions,
      argv,
      migrator,
    });
  } else {
    logger('info', 'Invalid command. Use --help to show available commands.');
  }

  exit();
}

main();
