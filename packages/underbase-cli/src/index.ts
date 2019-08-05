// tslint:disable:no-var-requires
// tslint:disable:no-console
import * as fs from 'fs-extra';
import * as path from 'path';
import { IConfigFile } from 'underbase/src/interfaces';
import * as yargs from 'yargs';
import { exit, logger } from './common/utils';

// Middlewares
import * as validation from './middlewares/validation';

// Commands
import * as initCmd from './commands/init';
import * as listCmd from './commands/list';
import * as migrateCmd from './commands/migrate';
import * as rerunCmd from './commands/rerun';
import * as statusCmd from './commands/status';
import * as unlockCmd from './commands/unlock';

const commands = {
  init: initCmd,
  list: listCmd,
  migrate: migrateCmd,
  status: statusCmd,
  unlock: unlockCmd,
  rerun: rerunCmd,
};

// Enable ES6 module for migrations files
require = require('esm')(module);

const argv = yargs
  .scriptName('underbase')
  .usage('Usage: $0 <command> [OPTIONS]')
  .command('migrate <migration>', migrateCmd.describe)
  .command('init', initCmd.describe)
  .command('list', listCmd.describe)
  .command('status', statusCmd.describe)
  .command('unlock', unlockCmd.describe)
  .command('rerun', rerunCmd.describe)
  .describe('config <path>', 'Configuration file path')
  .describe('db <url>', 'MongoDB connection URL')
  .describe('migrations-dir <path>', 'Migrations versions directory')
  .describe('backup', 'Enable automatic backups')
  .describe('backups-dir <path>', 'Backups directory')
  .describe('collection-name <name>', 'Migrations state collection')
  .describe('logs', 'Enable logs')
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
    (argv.backupsDir as string) ||
      (configFile.backupsDir as string) ||
      './migrations/backups',
  ),
  migrationsDir: path.resolve(
    (argv.migrationsDir as string) ||
      (configFile.migrationsDir as string) ||
      './migrations',
  ),
  mongodumpBinary:
    (argv.mongodumpBinary as string) ||
    (configFile.mongodumpBinary as string) ||
    'mongodump',
} as IConfigFile;

async function main() {
  validation.checkNoArgPassed(yargs, argv);

  const versions = fs.existsSync(config.migrationsDir as fs.PathLike)
    ? (fs
        .readdirSync(config.migrationsDir as fs.PathLike)
        .filter((v: string) => v.match(new RegExp(/^[\d].[\d]$/))) as string[])
    : [];

  if (Object.keys(commands).indexOf(argv._[0]) > -1) {
    validation.checkMigrationDirExists(config);
    validation.createbackupDir(config);

    await commands[argv._[0]].action({
      config,
      versions,
      argv,
    });
  } else {
    logger.error(
      'Invalid command. Use --help option to show available commands.',
    );
  }

  exit();
}

main();
