#!/usr/bin/env node

// tslint:disable:no-var-requires
// tslint:disable:no-console
import { IConfigFile } from '@underbase/types';
import { exit, logger } from '@underbase/utils';
import * as fs from 'fs-extra';
import * as path from 'path';
import * as yargs from 'yargs';

// CLI arguments
import * as args from './args';

// Middlewares
import * as validation from './middlewares/validation';

const argv = yargs
  .scriptName('underbase')
  .usage(args.usage)
  .command(args.commands.migrate.command, args.commands.migrate.describe)
  .command(args.commands.init.command, args.commands.init.describe)
  .command(args.commands.list.command, args.commands.list.describe)
  .command(args.commands.status.command, args.commands.status.describe)
  .command(args.commands.unlock.command, args.commands.unlock.describe)
  .command(args.commands.rerun.command, args.commands.rerun.describe)
  .options(args.options)
  .describe('version', 'Show package version')
  .help('h', 'Show this help message')
  .alias('h', 'help')
  .locale('en_US')
  .epilogue(args.docs)
  .parse();

let configFile: IConfigFile | any = {};

async function main() {
  if (fs.existsSync(path.resolve(argv.config))) {
    configFile = await import(path.resolve(argv.config));
  }

  const config = {
    // False disables logging
    logs: (argv.logs as boolean) || (configFile.logs as boolean) || true,
    // Null or a function
    logger: logger as any,
    // Enable/disable info log "already at latest."
    logIfLatest: true,
    // Migrations collection name. Defaults to 'migrations'
    collectionName: configFile.collectionName
      ? (configFile.collectionName as string)
      : (argv.collectionName as string),
    // MongDB url
    db: configFile.db ? (configFile.db as string) : (argv.db as string),
    migrationsDir: path.resolve(
      configFile.migrationsDir
        ? (configFile.migrationsDir as string)
        : (argv.migrationsDir as string),
    ),
    compiler: argv.compiler || configFile.compiler || undefined,
  } as IConfigFile;

  validation.checkNoArgPassed(yargs, argv);

  const versions = fs.existsSync(config.migrationsDir as fs.PathLike)
    ? (fs
        .readdirSync(config.migrationsDir as fs.PathLike)
        .filter((v: string) => v.match(new RegExp(/^[\d].[\d]$/))) as string[])
    : [];

  if (Object.keys(args.commands).indexOf(argv._[0]) > -1) {
    validation.checkMigrationDirExists(config);

    await args.commands[argv._[0]].action({
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
